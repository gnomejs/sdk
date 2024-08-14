import type { EnhancedErrorOptions, ErrorInfo } from "./abstractions.ts";
import { errorInfo } from "./error_info.ts";

/**
 * Represents an error that occurs when an invalid operation is performed.
 *
 * @example
 * ```ts
 * import { InvalidOperationError } from "@gnome/errors/invalid-operation-error";
 *
 * function test(isInBadState: boolean) {
 *      if (isInBadState) {
 *          throw new InvalidOperationError({ message: "Operation is invalid.", target: "test" });
 *      }
 * }
 *
 * test(true);
 */
export class InvalidOperationError extends Error {
    /**
     * Creates a new instance of the InvalidOperationError class.
     * @param message The error message.
     *
     * @example
     * ```ts
     * import { InvalidOperationError } from "@gnome/errors/invalid-operation-error";
     *
     * throw new InvalidOperationError("Operation is invalid.");
     * ```
     */
    constructor(message: string);
    /**
     * Creates a new instance of the InvalidOperationError class.
     * @param options The error options.
     *
     * @example
     * ```ts
     * import { InvalidOperationError } from "@gnome/errors/invalid-operation-error";
     *
     * function test(isInBadState: boolean) {
     *      if (isInBadState) {
     *          throw new InvalidOperationError({ message: "Operation is invalid.", target: "test" });
     *      }
     * }
     *
     * test(true);
     * ```
     */
    constructor(options: EnhancedErrorOptions);
    /**
     * Creates a new instance of the InvalidOperationError class.
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

        super(message ?? "Invalid operation.", options);
        this.name = "InvalidOperationError";
        this.link = options?.link ?? "https://jsr.io/@gnome/errors/doc/invalid-operation-error/~/InvalidOperationError";
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
     * import { InvalidOperationError } from "@gnome/errors/invalid-operation-error";
     *
     * try {
     *    throw new InvalidOperationError("Operation is invalid.");
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
