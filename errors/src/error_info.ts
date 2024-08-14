import type { ErrorInfo } from "./abstractions.ts";

/**
 * Converts an error to an error information object for serialization.
 *
 * @description
 * The error information object is a plain object that can be serialized to JSON,
 * YAML, or any other format. The error information object contains at least the
 * `message` and `code` properties.
 *
 * The `message` property is the error message and the `code` property is the
 * error name. The `target`, `link`, `innerError`, and `details` properties are optional.
 *
 * The error information does not include the stack trace.
 * @param e The error to get information from.
 * @returns The error information which is a plain object for serialization.
 * @example
 * ```ts
 * import { errorInfo } from "@gnome/errors/error-info";
 *
 * try {
 *    throw new Error("Something went wrong.");
 * catch (e) {
 *     console.log(errorInfo(e));
 * }
 */
// NOTE: this is test by the other error tests
export function errorInfo(e: Error, includeStack?: false): ErrorInfo {
    const fuzzy = e as unknown as Record<string, unknown>;
    if (typeof fuzzy.toObject === "function") {
        return fuzzy.toObject() as ErrorInfo;
    }

    let link: string | undefined = undefined;
    let target: string | undefined = undefined;
    if (typeof fuzzy.link === "string") {
        link = fuzzy.link as string;
    }

    if (typeof fuzzy.target === "string") {
        target = fuzzy.target as string;
    }

    let innerError: ErrorInfo | undefined = undefined;

    if (e.cause instanceof Error) {
        innerError = errorInfo(e.cause);
    }

    let details: ErrorInfo[] | undefined = undefined;

    if (e instanceof AggregateError) {
        for (const error of e.errors) {
            if (details === undefined) {
                details = [];
            }

            details.push(errorInfo(error));
        }
    }

    return {
        message: e.message,
        code: e.name,
        target: target,
        link: link,
        innerError: innerError,
        details: details,
        stack: includeStack ? e.stack : undefined,
    };
}
