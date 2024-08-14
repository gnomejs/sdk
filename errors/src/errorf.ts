import { sprintf } from "@std/fmt/printf";

/**
 * Creates a new SystemError with a formatted error message.
 *
 * @param message - The error message string.
 * @param args - Additional arguments to be formatted into the error message.
 * @returns A new SystemError instance.
 * @example
 * ```ts
 * import { errorf } from "@gnome/errors/errorf";
 *
 * const e = errorf("An error occurred: %s", "Something went wrong.");
 * console.error(e.message); // Output: An error occurred: Something went wrong.
 * ```
 */
export function errorf(message: string, ...args: unknown[]): Error {
    return new Error(sprintf(message, ...args));
}
