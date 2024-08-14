import type { ArgumentErrorInfo, ArgumentErrorOptions } from "./abstractions.ts";
import { errorInfo } from "./error_info.ts";

/**
 * Represents an error that occurs when an invalid argument
 * is passed to a function or method.
 *
 * @example
 * ```ts
 * import { ArgumentError } from "@gnome/errors/argument-error.";
 *
 * function test(name: string) {
 *  if (name === null || name === undefined) {
 *     throw new ArgumentError("name");
 *  }
 * }
 *
 * test(null);
 * ```
 */
export class ArgumentError extends Error {
    /**
     * Creates a new instance of the ArgumentError class.
     * @param argumentName The name of the invalid argument.
     *
     * @example
     * ```ts
     * import { ArgumentError } from "@gnome/errors/argument-error.";
     *
     * function test(name: string) {
     *  if (name === null || name === undefined) {
     *     throw new ArgumentError("name");
     *  }
     * }
     *
     * test(null);
     */
    constructor(argumentName: string);
    /**
     * Creates a new instance of the ArgumentError class.
     * @param options The error options.
     * ```ts
     * import { ArgumentError } from "@gnome/errors/argument-error.";
     *
     * function test(name: string) {
     *  if (name === null || name === undefined) {
     *     throw new ArgumentError({ name: "name", message: "Name must not be null." });
     *  }
     * }
     *
     * test(null);
     */
    constructor(options?: ArgumentErrorOptions);
    /**
     * Creates a new instance of the ArgumentError class.
     */
    constructor();
    constructor() {
        let o: ArgumentErrorOptions;
        if (arguments.length === 1) {
            if (typeof arguments[0] === "string") {
                o = { name: arguments[0] };
            } else {
                o = arguments[0];
            }
        } else {
            o = { name: "unknown" };
        }

        super(o.message ?? `Argument ${o.name} is invalid.`, o);
        this.name = "ArgumentNullError";
        this.argumentName = o.name;
        this.target = o.target;
        this.link = o.link ?? "https://jsr.io/@gnome/errors/doc/argument-error/~/ArgumentError";
    }

    /**
     * The name of the invalid argument.
     */
    argumentName: string;

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
     *
     * @returns The error as a plain object.
     * @example
     * ```ts
     * import { ArgumentError } from "@gnome/errors/argument-error.";
     *
     * try {
     *     throw new ArgumentError("name");
     * } catch (e) {
     *     console.log(e.toObject());
     * }
     * ```
     */
    toObject(): ArgumentErrorInfo {
        const e = this.cause;
        const innerError = e instanceof Error ? errorInfo(e) : undefined;

        return {
            message: this.message,
            code: this.name,
            name: this.argumentName,
            target: this.target,
            link: this.link,
            innerError: innerError,
        };
    }
}
