import type { EnhancedErrorOptions, ErrorInfo } from "./abstractions.ts";
import { errorInfo } from "./error_info.ts";

/**
 * Represents an error that occurs when a method or
 * functionality is not implemented.
 *
 * @example
 * ```ts
 * import { NotImplementedError } from "@gnome/errors/not-implemented-error";
 *
 * function test() {
 *      throw new NotImplementedError("function test() is not implemented.");
 * }
 *
 * test();
 * ```
 */
export class NotImplementedError extends Error {
    /**
     * Creates a new instance of the NotImplementedError class.
     * @param message The error message.
     * @example
     * ```ts
     * import { NotImplementedError } from "@gnome/errors/not-implemented-error";
     *
     * throw new NotImplementedError("Not implemented.");
     * ```
     */
    constructor(message: string);
    /**
     * Creates a new instance of the NotImplementedError class.
     *
     * @param options The error options.
     * @example
     * ```ts
     * import { NotImplementedError } from "@gnome/errors/not-implemented-error";
     *
     * throw new NotImplementedError({ message: "Not implemented.", target: "method" });
     * ```
     */
    constructor(options?: EnhancedErrorOptions);
    /**
     * Creates a new instance of the NotImplementedError class.
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

        super(message ?? "Not implemented.", options);
        this.name = "NotImplementedError";
        this.link = options?.link ?? "https://jsr.io/@gnome/errors/doc/not-implemented-error/~/NotImplementedError";
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
     * import { NotImplementedError } from "@gnome/errors/not-implemented-error";
     *
     * try {
     *    throw new NotImplementedError("Not implemented.");
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
