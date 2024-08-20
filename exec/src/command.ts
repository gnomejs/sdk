import { type CommandArgs, convertCommandArgs } from "./command_args.ts";
import type { ChildProcess, CommandOptions, Output } from "./types.ts";
import { getLogger } from "./set_logger.ts";

/**
 * Represents a command that can be executed.
 */
export class Command {
    file: string;
    protected args?: CommandArgs;
    protected options?: CommandOptions;

    static #pipeFactory?: PipeFactory;

    /**
     * Creates a new instance of the Command class.
     * @param file The executable command.
     * @param args The arguments for the command.
     * @param options The options for the command.
     */
    constructor(file: string, args?: CommandArgs, options?: CommandOptions) {
        this.file = file;
        this.args = args;
        this.options = options ?? {};
        this.options.log ??= getLogger();
    }

    toArgs(): string[] {
        const args = convertCommandArgs(this.args ?? []);
        return [this.file, ...args];
    }

    /**
     * Sets the current working directory for the command.
     * @param value The current working directory.
     * @returns The Command instance.
     */
    withCwd(value: string | URL): this {
        this.options ??= {};
        this.options.cwd = value;
        return this;
    }

    /**
     * Sets the environment variables for the command.
     * @param value The environment variables.
     * @returns The Command instance.
     */
    withEnv(value: Record<string, string>): this {
        this.options ??= {};
        this.options.env = value;
        return this;
    }

    /**
     * Sets the user ID for the command.
     * @param value The user ID.
     * @returns The Command instance.
     */
    withUid(value: number): this {
        this.options ??= {};
        this.options.uid = value;
        return this;
    }

    /**
     * Sets the group ID for the command.
     * @param value The group ID.
     * @returns The Command instance.
     */
    withGid(value: number): this {
        this.options ??= {};
        this.options.gid = value;
        return this;
    }

    /**
     * Sets the abort signal for the command.
     * @param value The abort signal.
     * @returns The Command instance.
     */
    withSignal(value: AbortSignal): this {
        this.options ??= {};
        this.options.signal = value;
        return this;
    }

    /**
     * Sets the arguments for the command.
     * @param value The arguments.
     * @returns The Command instance.
     */
    withArgs(value: CommandArgs): this {
        this.args = value;
        return this;
    }

    /**
     * Sets the stdin behavior for the command.
     * @param value The stdin behavior.
     * @returns The Command instance.
     */
    withStdin(value: "inherit" | "piped" | "null" | undefined): this {
        this.options ??= {};
        this.options.stdin = value;
        return this;
    }

    /**
     * Sets the stdout behavior for the command.
     * @param value The stdout behavior.
     * @returns The Command instance.
     */
    withStdout(value: "inherit" | "piped" | "null" | undefined): this {
        this.options ??= {};
        this.options.stdout = value;
        return this;
    }

    /**
     * Sets the stderr behavior for the command.
     * @param value The stderr behavior.
     * @returns The Command instance.
     */
    withStderr(value: "inherit" | "piped" | "null" | undefined): this {
        this.options ??= {};
        this.options.stderr = value;
        return this;
    }

    /**
     * Thenable method that allows the Command object to be used as a promise which calls the `output` method.
     * It is not recommended to use this method directly. Instead, use the `output` method.
     * @param onfulfilled A function called when the promise is fulfilled.
     * @param onrejected A function called when the promise is rejected.
     * @returns A promise that resolves to the output of the command.
     * @example
     * ```ts
     * var cmd = new Command("echo", ["hello world"], { stdout: 'piped' });
     * const result = await cmd;
     * console.log(result.code);
     * console.log(result.stdout);
     * console.log(result.text());
     * ```
     */
    then<TValue = Output, TError = Error | never>(
        onfulfilled?: ((value: Output) => TValue | PromiseLike<TValue>) | null | undefined,
        // deno-lint-ignore no-explicit-any
        onrejected?: ((reason: any) => TError | PromiseLike<TError>) | null | undefined,
    ): PromiseLike<TValue | TError> {
        return this.output().then(onfulfilled, onrejected);
    }

    /**
     * Runs the command asynchronously and returns a promise that resolves to the output of the command.
     * The stdout and stderr are set to `inherit`.
     * @returns A promise that resolves to the output of the command.
     */
    async run(): Promise<Output> {
        this.options ??= {};
        const { stdout, stderr } = this.options;
        try {
            this.options.stdout = "inherit";
            this.options.stderr = "inherit";
            return await this.output();
        } finally {
            this.options.stdout = stdout;
            this.options.stderr = stderr;
        }
    }

    /**
     * Runs the command synchronously and returns the output of the command.
     * The stdout and stderr are set to `inherit`.
     * @returns The output of the command.
     */
    runSync(): Output {
        this.options ??= {};
        const { stdout, stderr } = this.options;
        try {
            this.options.stdout = "inherit";
            this.options.stderr = "inherit";
            return this.outputSync();
        } finally {
            this.options.stdout = stdout;
            this.options.stderr = stderr;
        }
    }

    /**
     * Pipes the output of the command to another command or child process.
     * @param name The name of the command to pipe to.
     * @param args The arguments for the command.
     * @param options The options for the command.
     * @returns A Pipe instance that represents the piped output.
     */
    pipe(name: string, args?: CommandArgs, options?: CommandOptions): Pipe;
    pipe(command: Command | ChildProcess): Pipe;
    pipe(): Pipe {
        this.options ??= {};
        this.options.stdout = "piped";
        this.options.stderr = "inherit";

        if (arguments.length === 0) {
            throw new Error("Invalid arguments");
        }

        let next: ChildProcess | Command;
        if (typeof arguments[0] === "string") {
            const args = arguments[1] as CommandArgs;
            const options = arguments[2] as CommandOptions;
            const ctor = Object.getPrototypeOf(this).constructor;
            next = new ctor(arguments[0], args, options) as Command;
            next.withStdout("piped");
            next.withStdin("piped");
        } else {
            next = arguments[0];
        }

        Command.#pipeFactory ??= new PipeFactory((file, args, options) => {
            const ctor = Object.getPrototypeOf(this).constructor;
            next = new ctor(file, args, options) as Command;
            next.withStdin("piped");
            next.withStdout("piped");
            return next;
        });
        return Command.#pipeFactory.create(this.spawn()).pipe(next);
    }

    /**
     * Gets the output of the command as text.
     * @returns A promise that resolves to the output of the command as text.
     */
    async text(): Promise<string> {
        this.options ??= {};
        const { stdout } = this.options;
        try {
            this.options.stdout = "piped";
            const output = await this.output();
            return output.text();
        } finally {
            this.options.stdout = stdout;
        }
    }

    /**
     * Gets the output of the command as an array of lines.
     * @returns A promise that resolves to the output of the command as an array of lines.
     */
    async lines(): Promise<string[]> {
        this.options ??= {};
        const { stdout } = this.options;
        try {
            this.options.stdout = "piped";
            const output = await this.output();
            return output.lines();
        } finally {
            this.options.stdout = stdout;
        }
    }

    /**
     * Gets the output of the command as JSON.
     * @returns A promise that resolves to the output of the command as JSON.
     */
    async json(): Promise<unknown> {
        this.options ??= {};
        const { stdout } = this.options;
        try {
            this.options.stdout = "piped";
            const output = await this.output();
            return output.json();
        } finally {
            this.options.stdout = stdout;
        }
    }

    /**
     * Gets the output of the command.
     * @returns A promise that resolves to the output of the command.
     */
    output(): Promise<Output> {
        throw new Error("Not implemented");
    }

    /**
     * Gets the output of the command synchronously.
     * @returns The output of the command.
     */
    outputSync(): Output {
        throw new Error("Not implemented");
    }

    /**
     * Spawns a child process for the command.
     * @returns The spawned child process.
     */
    spawn(): ChildProcess {
        throw new Error("Not implemented");
    }
}

/**
 * Represents a pipe for executing commands and chaining them together.
 */
class Pipe {
    #promise: Promise<ChildProcess>;

    /**
     * Creates a new instance of the Pipe class.
     * @param process The initial ChildProcess to start the pipe with.
     * @param cmdFactory The factory function for creating Command instances.
     */
    constructor(
        private readonly process: ChildProcess,
        private readonly cmdFactory: CommandFactory,
    ) {
        this.#promise = Promise.resolve(process);
    }

    /**
     * Chains a command to the pipe.
     * @param name The name of the command to execute.
     * @param args The arguments to pass to the command.
     * @param options The options to configure the command.
     * @returns The updated Pipe instance.
     */
    pipe(name: string, args?: CommandArgs, options?: CommandOptions): Pipe;
    /**
     * Chains a ChildProcess, Command, or Output instance to the pipe.
     * @param next The next ChildProcess, Command, or Output instance to chain.
     * @returns The updated Pipe instance.
     */
    pipe(next: ChildProcess | Command | Output): Pipe;
    pipe(): Pipe {
        if (arguments.length === 0) {
            throw new Error("Invalid arguments");
        }

        if (typeof arguments[0] === "string") {
            const args = arguments[1] as CommandArgs;
            const options = arguments[2] as CommandOptions;
            const next = this.cmdFactory(arguments[0], args, options);
            return this.pipe(next);
        }

        const next = arguments[0];

        this.#promise = this.#promise.then(async (process) => {
            let child = next as ChildProcess;
            if (typeof next === "object" && "spawn" in next) {
                if ("stdin" in next) {
                    next.stdin("piped");
                }
                child = next.spawn();
            }

            try {
                // force stdin to close
                await process.stdout.pipeTo(child.stdin, { preventClose: false });
                if (!process.stdout.locked) {
                    await process.stdout.cancel();
                }

                // if (process.stderr.)
                //await process.stderr.cancel();
            } catch (ex) {
                throw new Error(
                    `Pipe failed for ${process}: ${ex.message} ${ex.stack}`,
                );
            }

            return child;
        });
        return this;
    }

    /**
     * Retrieves the output of the pipe as an Output instance.
     * @returns A Promise that resolves to the Output instance.
     */
    async output(): Promise<Output> {
        const process = await this.#promise;
        return process.output();
    }
}

/**
 * Represents a factory for creating Pipe instances.
 */
class PipeFactory {
    constructor(private readonly cmdFactory: CommandFactory) {}

    /**
     * Creates a new Pipe instance.
     * @param process The ChildProcess object to associate with the Pipe.
     * @returns A new Pipe instance.
     */
    create(process: ChildProcess): Pipe {
        return new Pipe(process, this.cmdFactory);
    }
}

/**
 * Represents a factory function that creates a command.
 * @param file - The file to execute.
 * @param args - Optional arguments for the command.
 * @param options - Optional options for the command.
 * @returns A command instance.
 */
export interface CommandFactory {
    (file: string, args?: CommandArgs, options?: CommandOptions): Command;
}

/**
 * Options for a shell command.
 */
export interface ShellCommandOptions extends CommandOptions {
    /**
     * Additional arguments to pass to the shell.
     */
    shellArgs?: string[];

    /**
     * Arguments for the command.
     */
    args?: CommandArgs;

    /**
     * Specifies whether the command is a file.
     */
    isFile?: boolean;
}

/**
 * Represents a shell command.
 */
export class ShellCommand extends Command {
    protected shellArgs?: string[];
    protected script: string;
    protected isFile?: boolean;

    /**
     * Creates a new instance of the ShellCommand class.
     * @param exe The executable command.
     * @param script The shell script or command to execute.
     * @param options The options for the shell command.
     */
    constructor(exe: string, script: string, options?: ShellCommandOptions) {
        super(exe, options?.args, options);
        this.shellArgs = options?.shellArgs;
        this.script = script;
        this.isFile = options?.isFile;
    }

    /**
     * Gets the file extension for the shell script.
     * @returns The file extension.
     */
    get ext(): string {
        return "";
    }

    override toArgs(): string[] {
        const { file, generated } = this.getScriptFile();
        const args = this.getShellArgs(file ?? this.script, generated || (this.isFile ?? false));
        return [this.file, ...args];
    }

    /**
     * Gets the shell arguments for the given script and file type.
     * @param script The shell script or command.
     * @param isFile Indicates whether the script is a file.
     * @returns An array of shell arguments.
     */
    // deno-lint-ignore no-unused-vars
    getShellArgs(script: string, isFile: boolean): string[] {
        const args = this.shellArgs ?? [];
        args.push(script);
        return args;
    }

    /**
     * Gets the script file information. The `file` property is undefined if the script is not a file.
     * @returns An object containing the script file path and whether it was generated.
     */
    getScriptFile(): { file: string | undefined; generated: boolean } {
        if (this.isFile || (!this.script.match(/\n/) && this.ext.length && this.script.trimEnd().endsWith(this.ext))) {
            return { file: this.script, generated: false };
        }

        return { file: undefined, generated: false };
    }
}
