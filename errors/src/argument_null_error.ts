import type { ArgumentErrorOptions } from "./abstractions.ts";
import { ArgumentError } from "./argument_error.ts";

/**
 * Represents an error that is thrown when an argument is null or undefined.
 *
 * @example
 * ```ts
 * import { ArgumentNullError } from "@gnome/errors/argument-null-error";
 *
 * function test(name: string) {
 *    if (name === null || name === undefined) {
 *        throw new ArgumentNullError("name");
 *    }
 * }
 *
 * test(null);
 */
export class ArgumentNullError extends ArgumentError {
    /**
     * Creates a new instance of the ArgumentNullError class.
     * @param argumentName The name of the invalid argument.
     */
    constructor(argumentName: string);
    /**
     * Creates a new instance of the ArgumentNullError class.
     * @param options The error options.
     */
    constructor(options: ArgumentErrorOptions);
    /**
     * Creates a new instance of the ArgumentNullError class.
     */
    constructor();
    constructor() {
        let o: ArgumentErrorOptions;
        const link = "https://jsr.io/@gnome/errors/doc/argument-range-error/~/ArgumentRangeError";
        if (arguments.length === 1) {
            if (typeof arguments[0] === "string") {
                o = { name: arguments[0], link };
            } else {
                o = arguments[0];
                o.link ??= link;
            }
        } else {
            o = { name: "unknown", link };
        }
        o.message ??= `Argument ${o.name} must not be null.`;
        super(o);
        this.name = "ArgumentNullError";
    }
}
