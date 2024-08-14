import type { EnhancedErrorOptions, ErrorInfo } from "./abstractions.ts";
import { errorInfo } from "./error_info.ts";

/**
 * Represents an error that occurs when an operation times out.
 *
 * @example
 * ```ts
 * import { TimeoutError } from "@gnome/errors/timeout-error";
 *
 * var controller = new AbortController();
 * var signal = controller.signal;
 *
 * setTimeout(() => {
 *  controller.abort(new TimeoutError("Operation timed out."));
 * }, 3000);
 *
 * // later in the code0
 *
 * if (signal.aborted) {
 *      console.log(signal.reason);
 * }
 * ```
 */
export class TimeoutError extends Error {
    /**
     * Creates a new instance of the TimeoutError class.
     * @param message The error message.
     *
     * @example
     * ```ts
     * import { TimeoutError } from "@gnome/errors/timeout-error";
     *
     * throw new TimeoutError("Operation timed out.");
     * ```
     */
    constructor(message: string);
    /**
     * Creates a new instance of the TimeoutError class.
     * @param options The error options.
     *
     * @example
     * ```ts
     * import { TimeoutError } from "@gnome/errors/timeout-error";
     *
     * throw new TimeoutError({ message: "Operation timed out.", target: "operation" });
     * ```
     */
    constructor(options: EnhancedErrorOptions);
    /**
     * Creates a new instance of the TimeoutError class.
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

        super(message ?? "Operation timed out.", options);
        this.name = "TimeoutError";
        this.link = options?.link ?? "https://jsr.io/@gnome/errors/doc/timeout-error/~/TimeoutError";
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
     * import { TimeoutError } from "@gnome/errors/timeout-error";
     *
     * try {
     *    throw new TimeoutError("Operation timed out.");
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
