import type { EnhancedErrorOptions, ErrorInfo } from "./abstractions.ts";
import { errorInfo } from "./error_info.ts";

/**
 * Represents an error that occurs when an operation is not supported.
 *
 * @example
 * ```ts
 * import { NotSupportedError } from "@gnome/errors/not-supported-error";
 *
 * let isWindows = false;
 * // check if os is windows
 * function test() {
 *      if (!isWindows) {
 *          throw new NotSupportedError("Operation is not supported on this platform. Only windows is suppored");}
 *      }
 * }
 *
 * test();
 */
export class NotSupportedError extends Error {
    /**
     * Creates a new instance of the NotSupportedError class.
     * @param message The error message.
     *
     * @example
     * ```ts
     * import { NotSupportedError } from "@gnome/errors/not-supported-error";
     *
     * throw new NotSupportedError("Operation is not supported.");
     * ```
     */
    constructor(message: string);
    /**
     * Creates a new instance of the NotSupportedError class.
     * @param options The error options.
     *
     * @example
     * ```ts
     * import { NotSupportedError } from "@gnome/errors/not-supported-error";
     *
     * throw new NotSupportedError({ message: "Operation is not supported.", target: "operation" });
     * ```
     */
    constructor(options: EnhancedErrorOptions);
    /**
     * Creates a new instance of the NotSupportedError class.
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

        super(message ?? "Not supported.", options);
        this.name = "NotSupportedError";
        this.link = options?.link ?? "https://jsr.io/@gnome/errors/doc/not-supported-error/~/NotSupportedError";
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
     * import { NotSupportedError } from "@gnome/errors/not-supported-error";
     *
     * try {
     *    throw new NotSupportedError("Operation is not supported.");
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
