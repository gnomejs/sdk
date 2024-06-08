import { type AnsiWriter, DefaultAnsiWriter } from "@gnome/ansi/writer";
import { AnsiLogLevel } from "@gnome/ansi/enums";
import { cyan, gray, green, yellow } from "@gnome/ansi/ansi";
import { CI, CI_PROVIDER } from "./ci.ts";
import { sprintf } from "@std/fmt/printf";
import { red } from "jsr:@gnome/ansi@^0.0.0/ansi";
import { env } from "@gnome/env";
import { writeTextFileSync } from "@gnome/fs";
import { stringify } from "@std/dotenv";
import { secretMasker as defaultSecretMasker } from "@gnome/secrets/masker";

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

export function setSecret(name: string, value: string): void {
    const secretsFile = env.get("GNOME_CI_SECRETS");
    if (secretsFile) {
        const values = stringify({ [name]: value });
        writeTextFileSync(secretsFile, values, { append: true });
    }
}

export class PipelineWriter extends DefaultAnsiWriter {
    override command(message: string, args: unknown[]): AnsiWriter {
        switch (CI_PROVIDER) {
            case "azdo":
                this.writeLine(`##vso[task.command]${message} ${args.join(" ")}`);
                return this;
            default: {
                const fmt = `[CMD]: ${message} ${defaultSecretMasker.mask(args.join(" "))}`;
                if (this.settings.stdout) {
                    this.writeLine(cyan(fmt));
                    return this;
                }
                this.writeLine(fmt);
                return this;
            }
        }
    }

    prependPath(path: string): AnsiWriter {
        env.path.prepend(path);

        switch (CI_PROVIDER) {
            case "azdo":
                this.writeLine(`##vso[task.prependpath]${path}`);
                return this;
            case "github": {
                const envPath = env.get("GITHUB_PATH");
                if (!envPath) {
                    this.error("GITHUB_PATH not set");
                    return this;
                }

                writeTextFileSync(envPath, `path\n`, { append: true });
                return this;
            }

            default:
                {
                    const envPath = env.get("GNOME_CI_PATH");
                    if (envPath) {
                        writeTextFileSync(envPath, `${path}\n`, { append: true });
                    }
                }
                return this;
        }
    }

    override progress(name: string, value: number): AnsiWriter {
        switch (CI_PROVIDER) {
            case "azdo":
                this.writeLine(`##vso[task.setprogress value=${value};]${name}`);
                return this;
            default:
                if (CI) {
                    this.writeLine(`${name}: ${green(value + "%")}`);
                    return this;
                }

                this.write(`\r${name}: ${green(value + "%")}`);
                return this;
        }
    }

    setOutput(name: string, value: string, secret = false): AnsiWriter {
        if (secret) {
            defaultSecretMasker.add(value);
        }

        switch (CI_PROVIDER) {
            case "azdo":
                if (secret) {
                    this.writeLine(`##vso[task.setvariable variable=${name};issecret=true;isoutput=true]${value}`);
                } else {
                    this.writeLine(`##vso[task.setvariable variable=${name};isoutput=true]${value}`);
                }
                return this;
            case "github": {
                const output = env.get("GITHUB_OUTPUT");
                if (!output) {
                    this.error("GITHUB_OUTPUT not set");
                    return this;
                }

                writeTextFileSync(output, `${name}=${value}`, { append: true });
                if (secret) {
                    this.writeLine(`::add-mask::${value}`);
                }

                return this;
            }

            default:
                {
                    const output = env.get("GNOME_CI_OUTPUT");
                    if (!output) {
                        this.error("GNOME_CI_OUTPUT not set");
                        return this;
                    }

                    const values = stringify({ [name]: value });
                    writeTextFileSync(output, values, { append: true });
                }

                return this;
        }
    }

    override exportVariable(name: string, value: string, secret = false): AnsiWriter {
        env.set(name, value);

        if (secret) {
            defaultSecretMasker.add(value);
        }

        switch (CI_PROVIDER) {
            case "azdo":
                if (secret) {
                    this.writeLine(`##vso[task.setvariable variable=${name};issecret=true;]${value}`);
                } else {
                    this.writeLine(`##vso[task.setvariable variable=${name}]${value}`);
                }
                return this;

            case "gitlab":
                {
                    const envPath = env.get("GITLAB_ENV");
                    if (!envPath) {
                        this.error("GITLAB_ENV not set");
                        return this;
                    }

                    writeTextFileSync(envPath, `${name}=${value}`, { append: true });
                }
                return this;

            case "github":
                {
                    const envPath = env.get("GITHUB_ENV");
                    if (!envPath) {
                        this.error("GITHUB_ENV not set");
                        return this;
                    }

                    writeTextFileSync(envPath, `${name}=${value}`, { append: true });
                    if (secret) {
                        this.writeLine(`::add-mask::${value}`);
                    }
                }

                return this;
            default: {
                const envPath = env.get("GNOME_CI_ENV");
                if (envPath) {
                    writeTextFileSync(envPath, stringify({ [name]: value }), { append: true });
                }

                setSecret(name, value);
                return this;
            }
        }
    }

    override startGroup(name: string): AnsiWriter {
        super.exportVariable;
        switch (CI_PROVIDER) {
            case "azdo":
                this.writeLine(`##[group]${name}`);
                return this;
            case "github":
                this.writeLine(`::group::${name}`);
                return this;
            default:
                return super.startGroup(name);
        }
    }

    override endGroup(): AnsiWriter {
        switch (CI_PROVIDER) {
            case "azdo":
                this.writeLine("##[endgroup]");
                return this;
            case "github":
                this.writeLine("::endgroup::");
                return this;
            default:
                return super.endGroup();
        }
    }

    override debug(e: Error, message?: string | undefined, ...args: unknown[]): AnsiWriter;
    override debug(message: string, ...args: unknown[]): AnsiWriter;
    override debug(): AnsiWriter {
        if (this.level < AnsiLogLevel.Debug) {
            return this;
        }

        const { msg, stack } = handleArguments(arguments);
        switch (CI_PROVIDER) {
            case "azdo":
                this.writeLine(`##[debug]${msg}`);
                if (stack) {
                    this.writeLine(stack);
                }
                return this;
            case "github":
                this.writeLine(`::debug::${msg}`);
                if (stack) {
                    this.writeLine(stack);
                }
                return this;
            default:
                {
                    const fmt = `[DBG]: ${msg}`;
                    if (this.settings.stdout) {
                        this.writeLine(gray(fmt));
                        if (stack) {
                            this.writeLine(red(stack));
                        }
                        return this;
                    }
                    this.writeLine(fmt);
                    if (stack) {
                        this.writeLine(stack);
                    }
                }
                return this;
        }
    }

    error(e: Error, message?: string | undefined, ...args: unknown[]): AnsiWriter;
    error(message: string, ...args: unknown[]): AnsiWriter;
    error(): AnsiWriter {
        if (this.level < AnsiLogLevel.Error) {
            return this;
        }

        const { msg, stack } = handleArguments(arguments);
        switch (CI_PROVIDER) {
            case "azdo":
                this.writeLine(`##[error]${msg}`);
                if (stack) {
                    this.writeLine(red(stack));
                }

                return this;

            case "github":
                this.writeLine(`::error::${msg}`);
                if (stack) {
                    this.writeLine(red(stack));
                }
                return this;

            default:
                {
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
                }

                return this;
        }
    }

    override warn(e: Error, message?: string | undefined, ...args: unknown[]): AnsiWriter;
    override warn(message: string, ...args: unknown[]): AnsiWriter;
    override warn(): AnsiWriter {
        if (this.level < AnsiLogLevel.Warning) {
            return this;
        }

        const { msg, stack } = handleArguments(arguments);
        switch (CI_PROVIDER) {
            case "azdo":
                this.writeLine(`##[warning]${msg}`);
                if (stack) {
                    this.writeLine(stack);
                }
                return this;
            case "github":
                this.writeLine(`::warning::${msg}`);
                if (stack) {
                    this.writeLine(stack);
                }
                return this;
            default:
                {
                    const fmt = `[WRN]: ${msg}`;
                    if (this.settings.stdout) {
                        this.writeLine(yellow(fmt));
                        if (stack) {
                            this.writeLine(red(stack));
                        }
                        return this;
                    }
                    this.writeLine(fmt);
                    if (stack) {
                        this.writeLine(stack);
                    }
                }
                return this;
        }
    }
}

export const writer: PipelineWriter = new PipelineWriter();

export { defaultSecretMasker as secretMasker };
