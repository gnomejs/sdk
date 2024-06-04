import { sprintf } from '@std/fmt/printf';
import { SystemError } from "./system_error.ts";


/**
 * Creates a new SystemError with a formatted error message.
 * 
 * @param message - The error message string.
 * @param args - Additional arguments to be formatted into the error message.
 * @returns A new SystemError instance.
 */
export function errorf(message: string, ...args: unknown[]): SystemError {
    return new SystemError(sprintf(message, ...args));
}