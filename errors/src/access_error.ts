import type { EnhancedErrorOptions, ErrorInfo } from "./abstractions.ts";
import { errorInfo } from "./error_info.ts";

/**
 * Represents an error that occurs when access to a resource is denied.
 *
 * @example
 * ```ts
 * import { AccessError } from "@gnome/errors/access-error";
 *
 * let allow = false;
 * // check if access is allowed
 * if (!allow)
 *    throw new AccessError("Access denied.");
 * ```
 */
export class AccessError extends Error {
    /**
     * Creates a new instance of the AccessError class.
     * @param message The error message.
     * @example
     * ```ts
     * import { AccessError } from "@gnome/errors/access-error";
     *
     * throw new AccessError("Access denied.");
     * ```
     */
    constructor(message: string);
    /**
     * Creates a new instance of the AccessError class.
     * @param options The error options.
     * @example
     * ```ts
     * import { AccessError } from "@gnome/errors/access-error";
     *
     * throw new AccessError({ message: "Access denied.", target: "operation" });
     * ```
     */
    constructor(options: EnhancedErrorOptions);
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

        super(message ?? "Access denied.", options);
        this.name = "AccessError";
        this.link = options?.link ?? "https://jsr.io/@gnome/errors/doc/access-error/~/AccessError";
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
     * import { AccessError } from "@gnome/errors/access-error";
     *
     * try {
     *    throw new AccessError("Access denied.");0
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
