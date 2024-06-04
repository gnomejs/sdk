import { SystemError } from "./system_error.ts";

/**
 * Represents an error that occurs when a method or
 * functionality is not implemented.
 */
export class NotImplementedError extends SystemError {
    /**
     * Creates a new instance of the NotImplementedError class.
     * @param message - The error message.
     */
    constructor(message?: string) {
        super(message || "Not implemented");
        this.name = "NotImplementedError";
    }
}