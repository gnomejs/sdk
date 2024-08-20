/**
 * ## Overview
 *
 * All errors in @gnome will inherit from `SystemError`
 *
 * The errors module extends the built-in Error class to provide
 * additional functionality such as:
 *
 * - `toObject()` method to convert an error to JSON
 *    object.
 * - `set()` method to set multiple properties of the error.
 * - `stackTrace` property to get the stack trace as an array of strings.
 * - `code` property to get or set the error code.
 * - `target` property to get or set the target of the error
 *    such as the name of the method that threw the error.
 *
 * The module also provides a number of error classes that extend
 * and utility functions to work with errors:
 *
 * - `collect()` function to collect all the errors from an error object.
 * - `walk()` function to walk through an error and its inner errors.
 * - `printError()` function to print an error to the console.
 *
 * ## Basic Usage
 *
 * ```typescript
 * import { SystemError } from '@gnome/errors'
 *
 * try {
 *    throw new SystemError("message");
 * } catch (e) {
 *    console.log(e.stackTrace)
 *    console.log(e.code)
 * }
 *
 * ```
 *
 * [MIT License](./LICENSE.md)
 */
export * from "./abstractions.ts";
export * from "./abort_error.ts";
export * from "./access_error.ts";
export * from "./argument_error.ts";
export * from "./argument_empty_error.ts";
export * from "./argument_null_error.ts";
export * from "./argument_range_error.ts";
export * from "./assertion_error.ts";
export * from "./collect.ts";
export * from "./error_info.ts";
export * from "./format_error.ts";
export * from "./invalid_cast_error.ts";
export * from "./invalid_operation_error.ts";
export * from "./not_implemented_error.ts";
export * from "./not_supported_error.ts";
export * from "./null_reference_error.ts";
export * from "./object_disposed_error.ts";
export * from "./response_error.ts";
export * from "./stacktrace.ts";
export * from "./timeout_error.ts";
export * from "./walk.ts";
