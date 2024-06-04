import { SystemError } from "./system_error.ts";

/**
 * Represents an error that occurs when an operation times out.
 */
export class TimeoutError extends SystemError {
    /**
     * Creates a new instance of the TimeoutError class.
     * @param message - The error message.
     */
    constructor(message?: string) {
        super(message || "Operation timed out.");
        this.name = "TimeoutError";
    }
}
