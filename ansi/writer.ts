import { env } from "@gnome/env";
import { AnsiSettings } from "./settings.ts";
import { blue, cyan, gray, green, magenta, red, yellow } from "./ansi.ts";
import { sprintf } from "@std/fmt/printf";
import { AnsiLogLevel } from "./enums.ts";
import { isStdoutTerminal } from "./settings.ts";

export { AnsiLogLevel, AnsiSettings };

export interface ISecretMasker {
    mask(value: string): string;
    add(value: string): ISecretMasker;
}

// deno-lint-ignore no-explicit-any
const g = globalThis as any;
let args: string[] = [];
let write = (message?: string) => {
    console.log(message);
};
if (typeof g.Deno !== "undefined") {
    args = Deno.args;
    write = (message?: string) => {
        Deno.stdout.writeSync(new TextEncoder().encode(message));
    };
} else if (typeof g.process !== "undefined") {
    args = g.process.argv.slice(2);
    write = (message?: string) => {
        g.process.stdout.write(message);
    };
}

function handleStack(stack?: string) {
    stack = stack ?? "";
    const index = stack.indexOf("\n");
    if (index === -1) {
        return stack;
    }

    return stack.substring(index + 1);
}

export function handleArguments(args: IArguments): { msg: string | undefined; stack: string | undefined } {
    let msg: string | undefined = undefined;
    let stack: string | undefined = undefined;

    switch (args.length) {
        case 0:
            return { msg, stack };
        case 1: {
            if (args[0] instanceof Error) {
                const e = args[0] as Error;
                msg = e.message;
                stack = handleStack(e.stack);
            } else {
                msg = args[0] as string;
            }

            return { msg, stack };
        }

        case 2: {
            if (args[0] instanceof Error) {
                const e = args[0] as Error;
                const message = args[1] as string;
                msg = message;
                stack = handleStack(e.stack);
            } else {
                const message = args[0] as string;
                const splat = Array.from(args).slice(1);
                msg = sprintf(message, ...splat);
            }
            return { msg, stack };
        }

        default: {
            if (args[0] instanceof Error) {
                const e = args[0] as Error;
                const message = args[1] as string;
                const splat = Array.from(args).slice(2);
                msg = sprintf(message, ...splat);
                stack = handleStack(e.stack);
            } else {
                const message = args[0] as string;
                const splat = Array.from(args).slice(1);
                msg = sprintf(message, ...splat);
            }

            return { msg, stack };
        }
    }
}

export interface AnsiWriter {
    readonly interactive: boolean;

    readonly settings: AnsiSettings;

    level: AnsiLogLevel;

    set secretMasker(value: ISecretMasker);

    enabled(level: AnsiLogLevel): boolean;

    startGroup(name: string): AnsiWriter;

    endGroup(): AnsiWriter;

    success(message: string, ...args: unknown[]): AnsiWriter;

    progress(name: string, value: number): AnsiWriter;

    command(message: string, ...args: unknown[]): AnsiWriter;

    debug(message: string, ...args: unknown[]): AnsiWriter;

    trace(message: string, ...args: unknown[]): AnsiWriter;

    info(message: string, ...args: unknown[]): AnsiWriter;

    error(e: Error, message?: string, ...args: unknown[]): AnsiWriter;
    error(message: string, ...args: unknown[]): AnsiWriter;

    warn(e: Error, message?: string, ...args: unknown[]): AnsiWriter;
    warn(message: string, ...args: unknown[]): AnsiWriter;

    write(message?: string, ...args: unknown[]): AnsiWriter;

    writeLine(message?: string, ...args: unknown[]): AnsiWriter;

    exportVariable(name: string, value: string, secret: boolean): AnsiWriter;
}

export class DefaultAnsiWriter implements AnsiWriter {
    #interactive?: boolean;
    #level: AnsiLogLevel;
    #secretMasker?: ISecretMasker;

    constructor(level?: AnsiLogLevel, secretMasker?: ISecretMasker) {
        this.#level = level ?? AnsiLogLevel.Debug;
        this.#secretMasker = secretMasker;
    }

    get level(): AnsiLogLevel {
        return this.#level;
    }

    set level(value: AnsiLogLevel) {
        this.#level = value;
    }

    set secretMasker(value: ISecretMasker) {
        this.#secretMasker = value;
    }

    enabled(level: AnsiLogLevel): boolean {
        return this.#level >= level;
    }

    get interactive(): boolean {
        if (this.#interactive !== undefined) {
            return this.#interactive;
        }

        if (env.get("CI") === "true") {
            this.#interactive = false;
            return false;
        }

        const isCi = [
            "CI",
            "GITHUB_ACTIONS",
            "GITLAB_CI",
            "CIRCLECI",
            "BITBUCKET_BUILD_NUMBER",
            "TF_BUILD",
            "JENKINS_URL",
        ].some((o) => env.has(o));

        if (isCi) {
            this.#interactive = false;
            return false;
        }

        if (env.get("DEBIAN_FRONTEND") === "noninteractive") {
            this.#interactive = false;
        }

        if (args.includes("-NonInteractive") || args.includes("--non-interactive")) {
            this.#interactive = false;
        }

        this.#interactive = isStdoutTerminal();
        return this.#interactive;
    }

    get settings(): AnsiSettings {
        return AnsiSettings.current;
    }

    progress(name: string, value: number): AnsiWriter {
        this.write(`${name}: ${value.toString().padStart(2)}% \r`);
        return this;
    }

    command(message: string, args: unknown[]): AnsiWriter {
        if (this.#level < AnsiLogLevel.Warning) {
            return this;
        }
        let splat = "";
        if (args.length > 0) {
            if (this.#secretMasker !== undefined) {
                splat = this.#secretMasker.mask(args.join(" "));
            } else {
                splat = args.join(" ");
            }
        }

        const fmt = `$ ${message} ${splat}`;
        if (this.settings.mode > 0) {
            this.writeLine(cyan(fmt));
            return this;
        }

        this.writeLine(fmt);
        return this;
    }

    exportVariable(name: string, value: string, secret = false): AnsiWriter {
        env.set(name, value);
        if (secret && this.#secretMasker !== undefined) {
            this.#secretMasker.add(value);
        }
        return this;
    }

    trace(message: string, ...args: unknown[]): AnsiWriter {
        if (this.#level > AnsiLogLevel.Debug) {
            return this;
        }

        const fmt = `[TRC]: ${args.length > 0 ? sprintf(message, ...args) : message}`;

        if (this.settings.mode > 0) {
            this.writeLine(gray(fmt));
            return this;
        }

        this.writeLine(fmt);
        return this;
    }

    debug(message: string, ...args: unknown[]): AnsiWriter {
        if (this.#level < AnsiLogLevel.Debug) {
            return this;
        }

        const fmt = `[DBG]: ${args.length > 0 ? sprintf(message, ...args) : message}`;

        if (this.settings.stdout) {
            this.writeLine(gray(fmt));
            return this;
        }

        this.writeLine(fmt);
        return this;
    }

    warn(e: Error, message?: string, ...args: unknown[]): AnsiWriter;
    warn(message: string, ...args: unknown[]): AnsiWriter;
    warn(): AnsiWriter {
        if (this.#level < AnsiLogLevel.Warning) {
            return this;
        }

        const { msg, stack } = handleArguments(arguments);
        const fmt = `[WRN]: ${msg}`;

        if (this.settings.stdout) {
            this.writeLine(yellow(fmt));
            if (stack) {
                this.writeLine(yellow(stack));
            }
            return this;
        }

        this.writeLine(fmt);
        if (stack) {
            this.writeLine(stack);
        }

        return this;
    }

    error(e: Error, message?: string, ...args: unknown[]): AnsiWriter;
    error(message: string, ...args: unknown[]): AnsiWriter;
    error(): AnsiWriter {
        if (this.#level < AnsiLogLevel.Error) {
            return this;
        }

        const { msg, stack } = handleArguments(arguments);
        const fmt = `[ERR]: ${msg}`;

        if (this.settings.stdout) {
            this.writeLine(red(fmt));
            if (stack) {
                this.writeLine(red(stack));
            }
            return this;
        }

        this.writeLine(fmt);
        if (stack) {
            this.writeLine(stack);
        }

        return this;
    }

    success(message: string, ...args: unknown[]): AnsiWriter {
        switch (arguments.length) {
            case 0:
                return this;

            case 1:
                {
                    if (this.settings.stdout) {
                        this.writeLine(green(`${message}`));
                    } else {
                        this.writeLine(`${message}`);
                    }
                }
                return this;

            default: {
                if (this.settings.stdout) {
                    this.writeLine(green(`${sprintf(message, ...args)}`));
                } else {
                    this.writeLine(`${sprintf(message, ...args)}`);
                }

                return this;
            }
        }
    }

    info(message: string, ...args: unknown[]): AnsiWriter {
        if (this.#level < AnsiLogLevel.Information) {
            return this;
        }
        const fmt = `[INF]: ${args.length > 0 ? sprintf(message, ...args) : message}`;

        if (this.settings.stdout) {
            this.writeLine(blue(fmt));
            return this;
        }

        this.writeLine(fmt);
        return this;
    }

    write(message?: string, ...args: unknown[]): AnsiWriter {
        if (message === undefined) {
            return this;
        }

        switch (arguments.length) {
            case 0:
                return this;

            case 1:
                write(message);
                break;

            default:
                {
                    const formatted = sprintf(message, ...args);
                    write(formatted);
                }

                break;
        }

        return this;
    }

    writeLine(message?: string, ...args: unknown[]): AnsiWriter {
        switch (arguments.length) {
            case 0:
                write("\n");
                break;

            case 1:
                write(`${message}\n`);
                break;

            default:
                {
                    const formatted = sprintf(`${message}\n`, ...args);
                    write(formatted);
                }

                break;
        }

        return this;
    }

    startGroup(name: string): AnsiWriter {
        if (this.settings.stdout) {
            this.writeLine(magenta(`> ${name}`));
        } else {
            this.writeLine(`> ${name}`);
        }

        return this;
    }

    endGroup(): AnsiWriter {
        this.writeLine();
        return this;
    }
}

export const writer: AnsiWriter = new DefaultAnsiWriter();
