import { SystemError } from "./system_error.ts";

/**
 * Represents an error that is thrown when an object has been disposed.
 */
export class ObjectDisposedError extends SystemError {
    /**
     * Creates a new instance of the ObjectDisposedError class.
     * @param message - The error message.
     * @param innerError - The inner error, if any.
     */
    constructor(message?: string, innerError?: Error) {
        super(message || "Object has been disposed.", innerError);
        this.name = "ObjectDisposedError";
    }
}