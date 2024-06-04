import { ArgumentError } from "./argument_error.ts";

/**
 * Represents an error that is thrown when an argument is null or undefined.
 */
export class ArgumentNullError extends ArgumentError {
    /**
     * Creates a new instance of the ArgumentNullError class.
     * @param parameterName - The name of the argument that is null or undefined.
     */
    constructor(parameterName: string | null = null) {
        super(`Argument ${parameterName} must not be null or undefined.`);
        this.parameterName = parameterName;
        this.name = "ArgumentError";
    }

    /**
     * Validates the specified value and throws an ArgumentNullError if it is null or undefined.
     * @param value - The value to validate.
     * @param parameterName - The name of the parameter being validated.
     * @throws ArgumentNullError if the value is null or undefined.
     */
    static validate(value: unknown, parameterName: string) {
        if (value === null || value === undefined) {
            throw new ArgumentNullError(parameterName);
        }
    }
}