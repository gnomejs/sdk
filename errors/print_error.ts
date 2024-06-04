import { SystemError } from "./system_error.ts";

/**
 * Prints the error to the console and if an error derives from SystemError,
 * it will print the inner error as well.
 *
 * @param e The error to print to the console.
 * @param format Formats the error to the console.
 * @returns
 */
export function printError(e: Error, format?: (e: Error) => string): void {
    if (e instanceof AggregateError && e.errors) {
        for (const error of e.errors) {
            printError(error, format);
        }
    }

    if (e instanceof SystemError && e.innerError instanceof Error) {
        printError(e.innerError, format);
    }

    if (format) {
        console.error(format(e));
        return;
    }

    console.error(e);
}