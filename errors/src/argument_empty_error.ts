import type { ArgumentErrorOptions } from "./abstractions.ts";
import { ArgumentError } from "./argument_error.ts";

/**
 * Represents an error that is thrown when an argument is null or empty.
 *
 * For strings this can be used for checking if a string is null, undefined, empty,
 * or contains only whitespace characters.
 *
 * For arrays this can be used for checking if an array is null, undefined, or empty.
 *
 * @example
 * ```ts
 * import { ArgumentEmptyError } from "@gnome/errors/argument-empty-error";
 *
 * function test(name: string) {
 *     if (name.length === 0) {
 *         throw new ArgumentEmptyError("name");
 *     }
 * }
 *
 * test("");
 * ```
 */
export class ArgumentEmptyError extends ArgumentError {
    /**
     * Creates a new instance of the ArgumentEmptyError class.
     * @param argumentName The name of the invalid argument.
     * @example
     * ```ts
     * import { ArgumentEmptyError } from "@gnome/errors/argument-empty-error";
     *
     * function test(name: string) {
     *   if (name.length === 0) {
     *      throw new ArgumentEmptyError("name");
     *   }
     *
     *   // do something
     * }
     *
     * test("");
     * ```
     */
    constructor(argumentName: string);
    /**
     * Creates a new instance of the ArgumentEmptyError class.
     * @param options The error options.
     * @example
     * ```ts
     * import { ArgumentEmptyError } from "@gnome/errors/argument-empty-error";
     *
     * function test(name: string) {
     *   if (name.length === 0) {
     *      throw new ArgumentEmptyError({ name: "name", message: "Name must not be empty." });
     *   }
     *
     *   // do something
     * }
     *
     * test("");
     * ```
     */
    constructor(options?: ArgumentErrorOptions);
    /**
     * Creates a new instance of the ArgumentEmptyError class.
     */
    constructor();
    constructor() {
        let o: ArgumentErrorOptions;
        const link = "https://jsr.io/@gnome/errors/doc/argument-empty-error/~/ArgumentEmptyError";
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

        o.message ??= `Argument ${o.name} must not be null or empty.`;
        super(o);
        this.name = "ArgumentEmptyError";
    }
}
