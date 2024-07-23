import { sprintf } from "@std/fmt/printf";

/**
 * Creates a new SystemError with a formatted error message.
 *
 * @param message - The error message string.
 * @param args - Additional arguments to be formatted into the error message.
 * @returns A new SystemError instance.
 */
export function errorf(message: string, ...args: unknown[]): Error {
    return new Error(sprintf(message, ...args));
}
