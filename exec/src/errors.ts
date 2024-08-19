import type { EnhancedErrorOptions, ErrorInfo } from "@gnome/errors";

/**
 * Represents an error that occurs when executing a command.
 */
export interface CommandErrorOptions extends ErrorOptions {
    /**
     * The exit code of the command.
     */
    exitCode?: number;
    /**
     * The name of the command.
     */
    fileName?: string;
    /**
     * The arguments passed to the command.
     */
    args?: string[];
    /**
     * The descriptor of the target when the error occurred.
     */
    target?: string;
    /**
     * A link to more information about the error.
     */
    link?: string;
    /**
     * The error message.
     */
    message?: string;
}

/**
 * Represents the serialized information for a command error.
 */
export interface CommandErrorInfo extends ErrorInfo {
    /**
     * The exit code of the command.
     */
    exitCode?: number;
    /**
     * The name of the command.
     */
    fileName?: string;
    /**
     * The arguments passed to the command.
     */
    args?: string[];
}

/**
 * Represents an error that occurs when executing a command.
 */
export class CommandError extends Error {
    /**
     * The exit code of the command.
     */
    exitCode?: number;
    /**
     * The name of the command.
     */
    fileName?: string;
    /**
     * The arguments passed to the command.
     */
    args?: string[];
    /**
     * The descriptor of the target when the error occurred.
     */
    target?: string;
    /**
     * A link to more information about the error.
     */
    link?: string;

    /**
     * Creates a new instance of the CommandError class.
     * @param options The options for the error.
     */
    constructor(options: CommandErrorOptions);
    /**
     * Creates a new instance of the CommandError class.
     * @param message The error message.
     */
    constructor(message?: string);
    /**
     * Creates a new instance of the CommandError class.
     */
    constructor() {
        const arg = arguments.length === 1 ? arguments[0] : undefined;
        const options = typeof arg === "object" ? arguments[0] : {};
        const message = typeof arg === "string" ? arguments[0] : options.message;

        super(message ?? `Command ${options?.fileName} failed with exit code ${options?.code}`, options);
        this.name = "CommandError";
        this.exitCode = options.exitCode;
        this.fileName = options.fileName;
        this.args = options.args;
        this.target = options.target;
        this.link = options.link ?? "https://jsr.io/@gnome/exec/doc/errors/~/CommandError";
    }

    /**
     * Converts the error to an object used for serialization.
     * @returns The serialized information for the error.
     */
    toObject(): CommandErrorInfo {
        return {
            code: this.name,
            message: this.message,
            exitCode: this.exitCode,
            fileName: this.fileName,
            args: this.args,
            target: this.target,
            link: this.link,
        } as CommandErrorInfo;
    }
}

/**
 * Represents an error that occurs when a command is not found on the PATH.
 */
export interface NotFoundOnPathErrorOptions extends EnhancedErrorOptions {
    /**
     * The name or path of the command that was not found.
     */
    exe?: string;
}

/**
 * Represents the serialized information for a command not found error.
 */
export interface NotFoundOnPathErrorInfo extends ErrorInfo {
    /**
     * The name or path of the command that was not found.
     */
    exe?: string;
}

export class NotFoundOnPathError extends Error {
    /**
     * The descriptor of the target when the error occurred.
     */
    target?: string;
    /**
     * A link to more information about the error.
     */
    link?: string;
    /**
     * The name or path of the command that was not found.
     */
    exe?: string;

    /**
     * Creates a new instance of the NotFoundOnPathError class.
     * @param options The options for the error.
     */
    constructor(options: NotFoundOnPathErrorOptions);
    /**
     * Creates a new instance of the NotFoundOnPathError class.
     * @param message The error message.
     */
    constructor(message: string);
    /**
     * Creates a new instance of the NotFoundOnPathError class.
     */
    constructor();
    constructor() {
        const arg = arguments.length === 1 ? arguments[0] : undefined;
        const options = typeof arg === "object" ? arguments[0] : {};
        const message = typeof arg === "string" ? arguments[0] : options.message;
        super(message ?? `Executable ${options.exe} not found on environment PATH.`, options);
        this.name = "NotFoundOnPathError";
        this.target = options.target;
        this.link = options.link ?? "https://jsr.io/@gnome/exec/doc/errors/~/NotFoundOnPathError";
        this.exe = options.exe;
    }
    /**
     * Converts the error to an object used for serialization.
     * @returns The serialized information for the error.
     */
    toObject(): NotFoundOnPathErrorInfo {
        return {
            code: this.name,
            message: this.message,
            target: this.target,
            link: this.link,
            exe: this.exe,
        } as NotFoundOnPathErrorInfo;
    }
}
