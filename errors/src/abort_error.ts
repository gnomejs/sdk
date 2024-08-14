import type { EnhancedErrorOptions, ErrorInfo } from "./abstractions.ts";
import { errorInfo } from "./error_info.ts";

/**
 * Represents an error that occurs when an operation is aborted.
 */
export class AbortError extends Error {
    /**
     * Creates a new instance of the AbortError class.
     * @param options The error options.
     * @example
     * ```ts
     * import { AbortError } from "@gnome/errors/abort-error";
     *
     * throw new AbortError({ message: "Operation was aborted.", target: "operation" });
     * ```
     */
    constructor(options?: EnhancedErrorOptions);
    /**
     * Creates a new instance of the AbortError class.
     * @param message The error message.
     * @example
     * ```ts
     * import { AbortError } from "@gnome/errors/abort-error";
     *
     * throw new AbortError("Operation was aborted.");
     * ```
     */
    constructor(message: string);
    /**
     * Creates a new instance of the AbortError class.
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

        super(message ?? "Operation aborted.", options);
        this.name = "AbortError";
        this.link = options?.link ?? "https://jsr.io/@gnome/errors/doc/abort-error/~/AbortError";
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
     * import { AbortError } from "@gnome/errors/abort-error";
     *
     * try {
     *    throw new AbortError("Operation was aborted.");
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
            code: this.name,
            message: this.message,
            target: this.target,
            link: this.link,
            stack: this.stack,
            innerError: innerError,
        };
    }
}
