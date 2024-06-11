import type { CommandArgs } from "./command_args.ts";
import { Command as CommandType, ShellCommand as ShellCommandType, type ShellCommandOptions } from "./command.ts";
import type { ChildProcess, CommandOptions, Output } from "./types.d.ts";
// deno-lint-ignore no-explicit-any
const g = globalThis as any;

/**
 * The implementation of the {@linkcode CommandType} to run.
 */
let Command = CommandType;
let ShellCommand = ShellCommandType;
if (g.process) {
    const { NodeCommand, NodeShellCommand } = await import("./node/mod.ts");
    Command = NodeCommand;
    ShellCommand = NodeShellCommand;
} else if (g.Deno) {
    const { DenoCommand, DenoShellCommand } = await import("./deno/mod.ts");
    Command = DenoCommand;
    ShellCommand = DenoShellCommand;
} else {
    throw new Error("Unsupported runtime");
}

export { Command, ShellCommand, type ShellCommandOptions };

/**
 * Creates a new command instance. This is a shorthand for creating a new
 * {@linkcode Command} instance and defaults the stdin to `inherit`, stderr
 *  to `piped`, and stdout to `piped` if the options are not set.
 *
 * @param exe - The executable to run.
 * @param args - The arguments to pass to the executable.
 * @param options - The options for the command.
 * @returns A new `CommandType` instance.
 */
export function cmd(exe: string, args?: CommandArgs, options?: CommandOptions): CommandType {
    options ??= {};
    options.stdin ??= "inherit";
    options.stderr ??= "piped";
    options.stdout ??= "piped";
    return new Command(exe, args, options);
}

/**
 * Run a command and return the output. This is a shorthand for creating a new
 * {@linkcode Command} and calling {@linkcode Command.output} with stdout and
 * stderr set to `inherit`.
 * @param exe The executable to run.
 * @param args The arguments to pass to the executable.
 * @param options The options to run the command with.
 * @returns The output of the command.
 */
export function run(
    exe: string,
    args?: CommandArgs,
    options?: Omit<CommandOptions, "stderr" | "stdout">,
): Promise<Output> {
    const o = (options || {}) as CommandOptions;
    o.stderr = "inherit";
    o.stdout = "inherit";

    return new Command(exe, args, o).output();
}

/**
 * Run a command and return the output synchronously. This is a shorthand for
 * creating a new {@linkcode Command} and calling {@linkcode Command.outputSync}
 * with stdout and stderr set to `inherit`.
 * @param exe The executable to run.
 * @param args The arguments to pass to the executable.
 * @param options The options to run the command with.
 * @returns The output of the command.
 */
export function runSync(exe: string, args?: CommandArgs, options?: Omit<CommandOptions, "stderr" | "stdout">): Output {
    const o = (options || {}) as CommandOptions;
    o.stderr = "inherit";
    o.stdout = "inherit";

    return new Command(exe, args, options).outputSync();
}

/**
 * Run a command and return the output. This is a shorthand for creating a new
 * {@linkcode Command} and calling {@linkcode Command.output} with stderr and
 * stdout defaulting to `piped` if not set in the options.
 * @param exe The executable to run.
 * @param args The arguments to pass to the executable.
 * @param options The options to run the command with.
 * @returns The output of the command.
 */
export function output(exe: string, args?: CommandArgs, options?: CommandOptions): Promise<Output> {
    options ??= {};
    options.stdin ??= "inherit";
    options.stderr ??= "piped";
    options.stdout ??= "piped";
    return new Command(exe, args, options).output();
}

/**
 * Run a command and return the output synchronously. This is a shorthand for
 * creating a new {@linkcode Command} and calling {@linkcode Command.outputSync}
 * with stderr and stdout defaulting to `piped` if not set in the options.
 * @param exe The executable to run.
 * @param args The arguments to pass to the executable.
 * @param options The options to run the command with.
 * @returns The output of the command.
 */
export function outputSync(exe: string, args?: CommandArgs, options?: CommandOptions): Output {
    options ??= {};
    options.stderr = "piped";
    options.stdout = "piped";
    return new Command(exe, args, options).outputSync();
}

/**
 * Spawn a command and return the process. This is a shorthand for creating a new
 * {@linkcode Command} and calling {@linkcode Command.spawn} with stdin, stderr,
 * and stdout defaulting to `inherit` if not set in the options.
 * @param exe The executable to run.
 * @param args The arguments to pass to the executable.
 * @param options The options to run the command with.
 * @returns The process of the command.
 */
export function spawn(exe: string, args?: CommandArgs, options?: CommandOptions): ChildProcess {
    options ??= {};
    options.stdin ??= "inherit";
    options.stderr ??= "inherit";
    options.stdout ??= "inherit";

    return new Command(exe, args, options).spawn();
}
