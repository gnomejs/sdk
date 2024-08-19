import { type AnsiWriter, DefaultAnsiWriter } from "../writer.ts";
import { AnsiLogLevel } from "../enums.ts";
import { cyan, gray, green, red, yellow } from "../ansi.ts";
import { CI, CI_PROVIDER } from "./provider.ts";
import { sprintf } from "@gnome/fmt/printf";
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
    /**
     * Write a command to the output.
     * @param command The name of the command.
     * @param args The arguments passed to the command.
     * @returns The writer instance.
     */
    override command(command: string, ...args: string[]): this {
        switch (CI_PROVIDER) {
            case "azdo":
                this.writeLine(`##vso[task.command]${command} ${args.join(" ")}`);
                return this;
            default: {
                const fmt = `[CMD]: ${command} ${defaultSecretMasker.mask(args.join(" "))}`;
                if (this.settings.stdout) {
                    this.writeLine(cyan(fmt));
                    return this;
                }
                this.writeLine(fmt);
                return this;
            }
        }
    }

    /**
     * Prepend a path to the environment path.
     * @param path The path to append to the environment path.
     * @returns The writer instance.
     */
    prependPath(path: string): this {
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

    /**
     * Writes the progress of an operation to the output.
     * @param name The name of the progress indicator.
     * @param value The value of the progress indicator.
     * @returns The writer instance.
     */
    override progress(name: string, value: number): this {
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

    /**
     * Set an output variable for the CI environment.
     * @param name The name of the output variable.
     * @param value The value of the output variable.
     * @param secret True if the value should be masked in the logs.
     * @returns
     */
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

    /**
     * Export a variable to the CI environment.
     *
     * @description
     * For Azure DevOps, the variable is set using the `##vso[task.setvariable]` command.
     * For GitHub Actions, the variable is set using the `GITHUB_ENV` variable.
     * For GitLab CI, the variable is set using the `GITLAB_ENV` variable.
     * For other CI providers, the variable is set using the `GNOME_CI_ENV` which is a file path
     * to a file that contains the environment variables.
     *
     * @param name The name of the variable.
     * @param value The value of the variable.
     * @param secret Whether the value should be masked in the logs.
     * @returns The writer instance.
     */
    override exportVariable(name: string, value: string, secret = false): this {
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

    /**
     * Start a new group of log messages.
     * @param name The name of the group.
     * @returns The writer instance.
     */
    override startGroup(name: string): this {
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

    /**
     * Ends the current group.
     * @returns The writer instance.
     */
    override endGroup(): this {
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

    /**
     * Write a debug message to the output.
     * @param e The error to write.
     * @param message The message to write.
     * @param args The arguments to format the message.
     * @returns The writer instance.
     */
    override debug(e: Error, message?: string | undefined, ...args: unknown[]): this;
    /**
     * Write a debug message to the output.
     * @param message The debug message.
     * @param args The arguments to format the message.
     * @returns The writer instance.
     */
    override debug(message: string, ...args: unknown[]): this;
    override debug(): this {
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

    error(e: Error, message?: string | undefined, ...args: unknown[]): this;
    /**
     * Write an error message to the output.
     * @param message The error message.
     * @param args The arguments to format the message.
     * @returns The writer instance.
     */
    error(message: string, ...args: unknown[]): this;
    error(): this {
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

    override warn(e: Error, message?: string | undefined, ...args: unknown[]): this;
    /**
     * Write a warning message to the output.
     * @param message The warning message.
     * @param args The arguments to format the message.
     * @returns The writer instance.
     */
    override warn(message: string, ...args: unknown[]): this;
    override warn(): this {
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
