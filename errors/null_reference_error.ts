import { SystemError } from "./system_error.ts";

/**
 * Represents an error that occurs when a null or undefined reference is encountered.
 */
export class NullReferenceError extends SystemError {
    /**
     * Creates a new instance of the NullReferenceError class.
     * @param message - The error message.
     */
    constructor(message?: string) {
        super(message || "Null or undefined reference");
        this.name = "NullReferenceError";
    }
}
