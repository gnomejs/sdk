import { ArgumentError } from "./argument_error.ts";

/**
 * Represents an error that is thrown when an argument is null or empty.
 */
export class ArgumentEmptyError extends ArgumentError {
    /**
     * Creates a new instance of the ArgumentEmptyError class.
     * @param parameterName - The name of the parameter that is null or empty.
     */
    constructor(parameterName: string | null = null) {
        super(`Argument ${parameterName} must not be null or empty.`);
        this.parameterName = parameterName;
        this.name = "ArgumentError";
    }
}
