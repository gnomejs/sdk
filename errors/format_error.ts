import { SystemError } from "./system_error.ts";

/**
 * Error for when a format is invalid.
 */
export class FormatError extends SystemError {
    /**
     * Creates a new FormatError.
     * @param message The error message.
     * @param innerError The inner error.
     */
    constructor(message: string, innerError?: Error) {
        super(message, innerError);
        this.name = "FormatError";
    }
}
