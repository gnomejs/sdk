import { SystemError } from "./system_error.ts";

/**
 * Represents an error that occurs when an operation is not supported.
 */
export class NotSupportedError extends SystemError {
    constructor(message?: string) {
        super(message || "Operation is not supported.");
        this.name = "NotSupportedError";
    }
}
