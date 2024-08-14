import { walk } from "./walk.ts";

/**
 * Collects all the errors from the given error object and its nested errors.
 *
 * @param e - The error object to collect errors from.
 * @returns An array of all the collected errors.
 * @example
 * ```ts
 * import { collect } from "@gnome/errors/collect"
 *
 * const e = new AggregateError([new Error(), new Error(), new AggregateError([new Error(), new Error()])]);
 * const errors = collect(e);
 * console.log(errors.length); // Output: 5
 * ```
 */
export function collect(e: Error): Error[] {
    const errors: Error[] = [];

    walk(e, (error) => errors.push(error));

    return errors;
}
