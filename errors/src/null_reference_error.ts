import type { EnhancedErrorOptions, ErrorInfo } from "./abstractions.ts";
import { errorInfo } from "./error_info.ts";

/**
 * Represents an error that occurs when a `null` or `undefined` reference is encountered.
 *
 * @example
 * ```ts
 * import { NullReferenceError } from "@gnome/errors/null-reference-error";
 *
 * let user: User | null = null;
 *
 * if (user === null) {
 *   throw new NullReferenceError("User is null.");
 * }
 * ```
 */
export class NullReferenceError extends Error {
    /**
     * Creates a new instance of the NullReferenceError class.
     * @param message The error message.
     *
     * @example
     * ```ts
     * import { NullReferenceError } from "@gnome/errors/null-reference-error";
     *
     * let user: User | null = null;
     *
     * if (user === null) {
     *    throw new NullReferenceError("User is null.");
     * }
     * ```
     */
    constructor(message: string);
    /**
     * Creates a new instance of the NullReferenceError class.
     * @param options The error options.
     *
     * @example
     * ```ts
     * import { NullReferenceError } from "@gnome/errors/null-reference-error";
     *
     * let user: User | null = null;
     * if (user === null) {
     *      throw new NullReferenceError({ message: "User is null.", target: "user" });
     * }
     * ```
     */
    constructor(options: EnhancedErrorOptions);
    /**
     * Creates a new instance of the NullReferenceError class.
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

        super(message ?? "Null reference found.", options);
        this.name = "NullReferenceError";
        this.link = options?.link ?? "https://jsr.io/@gnome/errors/doc/null-reference-error/~/NullReferenceError";
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
     * import { NullReferenceError } from "@gnome/errors/null-reference-error";
     *
     * try {
     *    throw new NullReferenceError("User is null.");
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
