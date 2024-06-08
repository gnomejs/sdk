import { type ErrorProps, SystemError } from "./system_error.ts";

/**
 * Represents an error that occurs when an invalid argument is passed to a function or method.
 */
export class ArgumentError extends SystemError {
    /**
     * The name of the invalid argument.
     */
    parameterName: string | null;

    /**
     * Creates a new instance of the ArgumentError class.
     * @param parameterName - The name of the invalid argument.
     * @param message - The error message.
     */
    constructor(parameterName: string | null = null, message?: string) {
        super(message || `Argument ${parameterName} is invalid.`);
        this.parameterName = parameterName;
        this.name = "ArgumentError";
    }

    /**
     * Converts the ArgumentError instance to a plain object.
     * @returns The plain object representation of the ArgumentError instance.
     */
    toObject(): ErrorProps & { parameterName: string | null } {
        return {
            ...super.toObject(),
            parameterName: this.parameterName,
        };
    }
}
