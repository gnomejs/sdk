import { SystemError } from "./system_error.ts";

/**
 * Represents an abort error.
 */
export class AbortError extends SystemError {
    constructor(message?: string) {
        super(message || "The operation was aborted.");
        this.name = "AbortError";
    }
}