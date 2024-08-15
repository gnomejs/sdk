
/**
 * Determines whether the given value is a valid Unicode character.
 * @param value The value to check.
 * @returns `true` if the value is a valid Unicode character; otherwise, `false`.
 * @example
 * ```ts
 * import { isChar } from "@gnome/chars";
 * 
 * console.log(isChar(0x1F600)); // Output: true
 * console.log(isChar(0x110000)); // Output: false
 * console.log(isChar(0x10FFFF)); // Output: true
 * console.log(isChar(0.32)); // Output: false
 * ```
 */
export function isChar(value: number): boolean {
    return Number.isInteger(value) && value >= 0 && value <= 0x10FFFF;
}

