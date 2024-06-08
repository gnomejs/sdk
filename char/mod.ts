/**
 * In JavaScript, characters are represented as integers which can be returned
 * by string functions `charCodeAt` and `codePointAt`.
 *
 * The char module provides functions to evaluate characters (integers)
 * such as `isLetter`, `isLetterAt`, `isDigit`, `isWhitespace`,
 * `isUpper`, `isLower`.
 *
 * ## Basic Usage

 * ```typescript
 * import { isUpperAt, isLowerAt, isDigit } from "@gnome/char/util";
 *
 * const str = "Hello, World 123";
 * console.log(isUpperAt(str, 0)); // true
 * console.log(isUpperAt(str, 1)); // false
 * console.log(isLowerAt(str, 1)); // false
 * console.log(isDigit(str, 1)); // false
 * console.log(isDigit(str, 14)); // true
 *
 * ```
 *
 * License: MIT
 * @module
 */

export * from "./constants.ts";
export * from "./utils.ts";
export * from "./char.ts";
