import { walk } from "./walk_error.ts";

/**
 * Collects all the errors from the given error object and its nested errors.
 *
 * @param e - The error object to collect errors from.
 * @returns An array of all the collected errors.
 */
export function collect(e: Error): Error[] {
    const errors: Error[] = [];

    walk(e, (error) => errors.push(error));

    return errors;
}
