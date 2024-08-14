import type { EnhancedErrorOptions, ErrorInfo } from "./abstractions.ts";
import { errorInfo } from "./error_info.ts";

/**
 * Error for when a format is invalid.  This can be used to indicate that a value
 * is not in the expected format such as a string or document.
 *
 * @example
 * ```ts
 * import { FormatError } from "@gnome/errors/format-error";
 *
 * function test(usCurrency: string) {
 *     if (!/^\$\d+\.\d{2}$/.test(usCurrency)) {
 *         throw new FormatError({ message: "Invalid US currency format.", target: "usCurrency
 *     }
 * }
 *
 * test("$100.00");
 * test("£100.00");
 * ```
 */
export class FormatError extends Error {
    /**
     * Creates a new instance of the FormatError class.
     * @param message The error message.
     * @example
     * ```ts
     * import { FormatError } from "@gnome/errors/format-error";
     *
     * throw new FormatError("Format is invalid.");
     * ```
     */
    constructor(message: string);
    /**
     * Creates a new instance of the FormatError class.
     * @param options The error options.
     * @example
     * ```ts
     * import { FormatError } from "@gnome/errors/format-error";
     *
     * throw new FormatError({ message: "Format is invalid.", target: "user.name" });
     * ```
     */
    constructor(options: EnhancedErrorOptions);
    /**
     * Creates a new instance of the FormatError class.
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

        super(message ?? "Invalid format.", options);
        this.name = "FormatError";
        this.link = options?.link ?? "https://jsr.io/@gnome/errors/doc/format-error/~/FormatError";
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
     * import { AbortError } from "@gnome/errors/format-error";
     *
     * try {
     *    throw new FormatError("Format is invalid.");
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
