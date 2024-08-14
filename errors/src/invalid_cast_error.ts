import type { EnhancedErrorOptions, ErrorInfo } from "./abstractions.ts";
import { errorInfo } from "./error_info.ts";

/**
 * Represents an error that occurs when an invalid cast is attempted.
 *
 * @example
 * ```ts
 * import { InvalidCastError } from "@gnome/errors/invalid-cast-error";
 *
 * const user = new User();
 * const monster = user as Monster;
 *
 * if (!(monster instanceof Monster)) {
 *   throw new InvalidCastError("Invalid of User class to Monster class.");
 * }
 */
export class InvalidCastError extends Error {
    /**
     * Creates a new instance of the InvalidCastError class.
     * @param message The error message.
     * @example
     * ```ts
     * import { InvalidCastError } from "@gnome/errors/invalid-cast-error";
     *
     * throw new InvalidCastError("Invalid of User class to Monster class.");
     * ```
     */
    constructor(message: string);
    /**
     * Creates a new instance of the InvalidCastError class.
     * @param options The error options.
     * @example
     * ```ts
     * import { InvalidCastError } from "@gnome/errors/invalid-cast-error";
     *
     * throw new InvalidCastError({ message: "Invalid of User class to Monster class.", target: "user" });
     * ```
     */
    constructor(options: EnhancedErrorOptions);
    /**
     * Creates a new instance of the InvalidCastError class.
     */
    constructor();
    constructor() {
        let message: string | undefined;
        let options: EnhancedErrorOptions | undefined;

        if (arguments.length === 1) {
            if (typeof arguments[0] === "string") {
                message = arguments[0];
            } else {
                options = arguments[0];
                message = options?.message;
            }
        } else {
            options = {};
        }

        super(message ?? "Invalid cast.", options);
        this.name = "InvalidCastError";
        this.link = options?.link ?? "https://jsr.io/@gnome/errors/doc/invalid-cast-error/~/InvalidCastError";
        this.target = options?.target;
    }

    /**
     * A descriptor for associated target for the error.
     */
    target?: string;

    /**
     * A link to help documentation.
     */
    link?: string;

    /**
     * Converts the error to an object that can be serialized.
     * @returns The error as a plain object.
     *
     * @example
     * ```ts
     * import { InvalidCastError } from "@gnome/errors/invalid-cast-error";
     *
     * try {
     *    throw new InvalidCastError("Invalid of User class to Monster class.");
     * } catch (error) {
     *    console.log(error.toObject());
     * }
     * ```
     */
    toObject(): ErrorInfo {
        let innerError: ErrorInfo | undefined = undefined;
        if (this.cause instanceof Error) {
            innerError = errorInfo(this.cause);
        }

        return {
            message: this.message,
            code: this.name,
            stack: this.stack,
            innerError: innerError,
            target: this.target,
            link: this.link,
        };
    }
}
