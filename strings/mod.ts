/**
 * The strings module provides case insenstive methods like `equalsIgnoreCase`,
 * `includesIgnoreCase`, `indexOfIgnoreCase`, `startsWithIgnoreCase`, and `endsWithIgnoreCase`
 * to avoid using string allocation by using comparisons with toLowerCase/toUpperCase.
 *
 * A `Utf8StringBuilder` class is included to avoid allocations for building text.
 *
 * Trim methods that take other characters than whitespace for trimming a string.
 *
 * Inflections are included from [github.com/dreamerslab/node.inflection](https://github.com/dreamerslab/node.inflection/blob/master/src/inflection.ts)
 * under the MIT.
 *
 * ## Basic Usage
 *
 * ```typescript
 * import * from str from '@gnome/strings'
 *
 * console.log(str.equalIgnoreCase("left", "LeFT")); // true
 * console.log(str.trimEnd("my random text...", ".")); // my random text
 * console.log(str.underscore("first-place")); // first_place
 *
 * // useful for FFI
 * var sb = new str.Utf8StringBuilder()
 * sb.append("test")
 *    .append(new TextEncoder().encode(": another test"));
 *
 * // faster
 * sb.appendString("test")
 *  .appendUtf8Array(new TextEncoder().encode(": another test"))
 *
 * console.log(sb.toString())
 * ```
 *
 * @module
 */

export * from "./utf8_string_builder.ts";
export * from "./string_builder.ts";
export * from "./utils.ts";
export * from "./transform.ts";
export * from "./utils.ts";
