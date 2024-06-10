import { ArgumentError } from "./argument_error.ts";

/**
 * Represents an error that occurs when an argument is out of range.
 * @extends ArgumentError
 */
export class ArgumentRangeError extends ArgumentError {
    /**
     * Creates a new instance of the ArgumentRangeError class.
     * @param parameterName - The name of the parameter that is out of range.
     * @param message - The error message.
     */
    constructor(parameterName: string | null = null, message?: string) {
        super(message || `Argument ${parameterName} is out of range.`);
        this.parameterName = parameterName;
        this.name = "ArgumentError";
    }
}
