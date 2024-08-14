import type { EnhancedErrorOptions, ErrorInfo } from "./abstractions.ts";
import { errorInfo } from "./error_info.ts";

/**
 * Represents an error that is thrown when an assertion fails.
 *
 * @example
 * ```ts
 * import { AssertionError } from "@gnome/errors/assertion-error";
 *
 * function assertExperience(yearsOfExperience: number) {
 *      if (yearsOfExperience < 2)
 *         throw new AssertionError({ message: "years of experience must be 2 or greater", target: "yearsOfExperience" });
 * }
 *
 * assertExperience(1);
 * ```
 */
export class AssertionError extends Error {
    /**
     * Creates a new instance of the AssertionError class.
     * @param options The error options.
     * @example
     * ```ts
     * import { AssertionError } from "@gnome/errors/assertion-error";
     *
     * throw new AssertionError({ message: "Assertion failed.", target: "operation" });
     * ```
     */
    constructor(options: EnhancedErrorOptions);
    /**
     * Creates a new instance of the AssertionError class.
     * @param message The error message.
     * ```ts
     * import { AssertionError } from "@gnome/errors/assertion-error";
     *
     * throw new AssertionError("Value must be greater than zero.");
     * ```
     */
    constructor(message: string);
    /**
     * Creates a new instance of the AssertionError class.
     */
    constructor();
    constructor() {
        let o: EnhancedErrorOptions;
        if (arguments.length === 1) {
            if (typeof arguments[0] === "string") {
                o = { message: arguments[0] };
            } else {
                o = arguments[0];
            }
        } else {
            o = {};
        }

        o.message ??= "Assertion failed.";
        super(o.message, o);
        this.name = "AssertionError";
        this.link = o.link ?? "https://jsr.io/@gnome/errors/doc/assertion-error/~/AssertionError";
        this.target = o.target;
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
     * import { AssertionError } from "@gnome/errors/assertion-error";
     *
     * try {
     *    throw new AssertionError("Failed assertion.");
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
            target: this.target,
            link: this.link,
            innerError: innerError,
        };
    }
}
