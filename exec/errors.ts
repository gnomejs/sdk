import { SystemError } from "@gnome/errors";

export class CommandError extends SystemError {
    exitCode?: number;
    fileName?: string;
    args?: string[];

    constructor(fileName?: string, code?: number, message?: string, innerError?: Error) {
        super(message ?? `Command ${fileName} failed with exit code ${code}`, innerError);
        this.exitCode = code;
        this.fileName = fileName;
        this.name = "CommandError";
    }
}

export class NotFoundOnPathError extends CommandError {
    constructor(exe: string) {
        super(`Executable ${exe} not found on environment PATH.`);
    }
}
