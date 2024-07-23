/**
 * ## Overview
 *
 * In JavaScript, characters are represented as integers which can be returned
 * by string functions `charCodeAt` and `codePointAt`.
 *
 * The char module provides functions to evaluate characters (integers)
 * such as `isLetter`, `isLetterAt`, `isDigit`, `isWhitespace`,
 * `isUpper`, `isLower`.
 *
 * ## Basic Usage
 *
 * ```typescript
 * import {
 *     isUpperAt,
 *     isLowerAt,
 *     isDigit,
 *     isAscii,
 *     isLatin1,
 *     isWhiteSpaceAt
 * }
 *
 * from "@gnome/char/util";
 *
 * const str = "Hello, World 123";
 * console.log(isUpperAt(str, 0)); // true
 * console.log(isUpperAt(str, 1)); // false
 * console.log(isLowerAt(str, 1)); // false
 * console.log(isDigit(str, 1)); // false
 * console.log(isDigit(str, 14)); // true
 *
 * console.log(isAsciiAt("⇼", 0)); // false
 * console.log(isLatin1At("⇼", 0)); // false
 *
 * const str2 = " \n\r\t"
 * console.log(isWhitespaceAt(str2, 0)); // true
 * console.log(isWhitespaceAt(str2, 1)); // true
 * console.log(isWhitespaceAt(str2, 2)); // true
 * console.log(isWhitespaceAt(str2, 3)); // true
 * ```
 *
 * ## Notes
 *
 * The overall goal for the char module to enable inspecting
 * characters and avoid string allocations when possible.
 *
 * When checking for upper case and lower case characters outside
 * of latin1 characters, the fall back uses regex like `/\\p{L}/`
 * to handle it as JavaScript has limited built in globalization
 * capabilities through regex and the Intl api.
 *
 * ## License
 *
 * [MIT License](./LICENSE.md) and the MIT License from the dotnet runtime,
 * see license file for additional notes.
 */

export * from "./constants.ts";
export * from "./utils.ts";
export * from "./char.ts";
