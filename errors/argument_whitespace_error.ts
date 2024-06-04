import { ArgumentError } from "./argument_error.ts";

/**
 * Represents an error that is thrown when an argument
 * is null, empty, or whitespace.
 */
export class ArgumentWhiteSpaceError extends ArgumentError {
    /**
     * Creates a new instance of the ArgumentWhiteSpaceError class.
     * @param parameterName - The name of the parameter that caused the error.
     */
    constructor(parameterName: string | null = null) {
        super(
            `Argument ${parameterName} must not be null, empty, or whitespace.`,
        );
        this.parameterName = parameterName;
        this.name = "ArgumentError";
    }
}