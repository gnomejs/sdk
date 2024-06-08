import { Char } from "./char.ts";

// deno-fmt-ignore
// from dotnet/runtime/src/libraries/System.Private.CoreLib/src/System/Char.cs
// Licensed to the .NET Foundation under one or more agreements.
const latin = [0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x8E, 0x8E, 0x8E, 0x8E, 0x8E, 0x0E, 0x0E, // U+0000..U+000F
0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, // U+0010..U+001F
0x8B, 0x18, 0x18, 0x18, 0x1A, 0x18, 0x18, 0x18, 0x14, 0x15, 0x18, 0x19, 0x18, 0x13, 0x18, 0x18, // U+0020..U+002F
0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x18, 0x18, 0x19, 0x19, 0x19, 0x18, // U+0030..U+003F
0x18, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, // U+0040..U+004F
0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x14, 0x18, 0x15, 0x1B, 0x12, // U+0050..U+005F
0x1B, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, // U+0060..U+006F
0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x14, 0x19, 0x15, 0x19, 0x0E, // U+0070..U+007F
0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x8E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, // U+0080..U+008F
0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, // U+0090..U+009F
0x8B, 0x18, 0x1A, 0x1A, 0x1A, 0x1A, 0x1C, 0x18, 0x1B, 0x1C, 0x04, 0x16, 0x19, 0x0F, 0x1C, 0x1B, // U+00A0..U+00AF
0x1C, 0x19, 0x0A, 0x0A, 0x1B, 0x21, 0x18, 0x18, 0x1B, 0x0A, 0x04, 0x17, 0x0A, 0x0A, 0x0A, 0x18, // U+00B0..U+00BF
0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, // U+00C0..U+00CF
0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x19, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x21, // U+00D0..U+00DF
0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, // U+00E0..U+00EF
0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x19, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21,] // U+00F0..U+00FF]

const latinLowerMask = 0x20;
const latinUpperMask = 0x40;
const whitespaceFlag = 0x80;
const latinZero = 48;
const latinNine = 57;

const latinMax = 255;
const asciiMax = 127;

const IS_LETTER_EXP = new RegExp("\\p{L}", "u");
const IS_UPPER_EXP = new RegExp("\\p{Lu}", "u");
const IS_LOWER_EXP = new RegExp("\\p{Ll}", "u");

/**
 * Returns the character at the specified index of a string.
 *
 * @param value - The string from which to retrieve the character.
 * @param index - The index of the character to retrieve.
 * @returns The character at the specified index.
 *
 * @example
 * ```ts
 * import { charAt } from "@gnome/char";
 * const value = "Hello, World!";
 * const char = charAt(value, 0);
 * ```
 */
export function charAt(value: string, index: number): Char {
    return new Char(value.codePointAt(index) as number);
}

/**
 * Checks if the given value is an ASCII character.
 *
 * @param value - The value to check.
 * @returns `true` if the value is an ASCII character, `false` otherwise.
 *
 * @example
 * ```typescript
 * import { isAscii } from '@gnome/char';
 *
 * const result = isAscii(65);
 * // result: true
 * ```
 */
export function isAscii(value: number): boolean {
    return value < asciiMax;
}

/**
 * Checks if the character at the specified index in the given string is an ASCII character.
 *
 * @param str - The input string.
 * @param index - The index of the character to check.
 * @returns A boolean indicating whether the character at the specified index is an ASCII character.
 *
 * @example
 * ```typescript
 * import { isAsciiAt } from "@gnome/char";
 * const str = "Hello, world!";
 * const index = 4;
 * const isAscii = isAsciiAt(str, index);
 * console.log(isAscii); // Output: true
 * ```
 */
export function isAsciiAt(value: string, index: number): boolean {
    return value.codePointAt(index) as number < asciiMax;
}

/**
 * Checks if a character is between two other characters.
 * @param value - The character to check.
 * @param start - The starting character.
 * @param end - The ending character.
 * @returns `true` if the character is between the start and end characters, `false` otherwise.
 *
 * @example
 * ```typescript
 * import { isBetween } from "@gnome/char";
 *
 * const value = 65;
 * const start = 65;
 * const end = 90;
 * const result = isBetween(value, start, end);
 * console.log(result); // Output: true
 * ```
 */
export function isBetween(value: number, start: number, end: number): boolean {
    return value >= start && value <= end;
}

/**
 * Checks if the given value is a digit.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a digit, `false` otherwise.
 *
 * @example
 * ```typescript
 * import { isDigit } from '@gnome/char';
 *
 * console.log(isDigit('5'.charCodeAt(0))); // Output: true
 * console.log(isDigit('a'.charCodeAt(0))); // Output: false
 * ```
 */
export function isDigit(value: number): boolean {
    return value >= latinZero && value <= latinNine;
}

/**
 * Checks if the character at the specified index in the given string is a digit.
 *
 * @param value - The string to check.
 * @param index - The index of the character to check.
 * @returns `true` if the character at the specified index is a digit, `false` otherwise.
 * @example
 * ```typescript
 * import { isDigitAt } from "@gnome/char";
 *
 * const str = "Hello, world!";
 * const index = 4;
 * const isDigit = isDigitAt(str, index);
 * console.log(isDigit); // Output: false
 *
 * const str1 = "Hello, 123!";
 * const index1 = 8;
 * const isDigit1 = isDigitAt(str1, index1);
 * console.log(isDigit1); // Output: true
 *
 * ```
 */
export function isDigitAt(value: string, index: number): boolean {
    const code = value.charCodeAt(index) as number;
    return code >= latinZero && code <= latinNine;
}

/**
 * Checks if the character at the specified index in the given string is a digit.
 *
 * @param value - The string to check.
 * @param index - The index of the character to check.
 * @returns `true` if the character at the specified index is a digit, `false` otherwise.
 *
 * @example
 * ```typescript
 * import { isDigitUtf16At } from "@gnome/char";
 *
 * const str = "Hello, world!";
 * const index = 4;
 * const isDigit = isDigitUtf16At(str, index);
 * console.log(isDigit); // Output: false
 *
 * const str1 = "Hello, 123!";
 * const index1 = 8;
 * const isDigit1 = isDigitUtf16At(str1, index1);
 * console.log(isDigit1); // Output: true
 * ```
 */
export function isDigitUtf16At(value: string, index: number): boolean {
    const code = value.codePointAt(index) as number;
    if (code === undefined) {
        return false;
    }
    return code >= latinZero && code <= latinNine;
}

/**
 * Checks if the character at the specified index in the given string is a Latin-1 character.
 * Latin-1 characters have code points less than the `latinMax` constant.
 *
 * @param value - The string to check.
 * @param index - The index of the character to check.
 * @returns `true` if the character at the specified index is a Latin-1 character, `false` otherwise.
 *
 * @example
 * ```typescript
 * import { isLatin1At } from "@gnome/char";
 *
 * const str = "Hello, world!";
 * const index = 4;
 * const isLatin1 = isLatin1At(str, index);
 * console.log(isLatin1); // Output: true
 * ```
 */
export function isLatin1At(value: string, index: number): boolean {
    return value.codePointAt(index) as number < latinMax;
}

/**
 * Checks if the given value is a Latin-1 character.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a Latin-1 character, `false` otherwise.
 *
 * @example
 * ```typescript
 * import { isLatin1 } from '@gnome/char';
 *
 * console.log(isLatin1("Ď".charCodeAt(0))); // Output: false
 * console.log(isLatin1(65)); // Output: true
 * console.log(isLatin1(256)); // Output: false
 * ```
 */
export function isLatin1(value: number): boolean {
    return value < latinMax;
}

/**
 * Checks if the given value represents a letter.
 *
 * @param value - The numeric value to check.
 * @returns `true` if the value represents a letter, `false` otherwise.
 *
 * @example
 * ```typescript
 * import { isLetter } from '@gnome/char';
 *
 * console.log(isLetter(65)); // char 'A' Output: true
 * console.log(isLetter(48)); // char '0'  Output: false
 * ```
 */
export function isLetter(value: number): boolean {
    if (value <= latinMax) {
        // For the version of the Unicode standard the Char type is locked to, the
        // ASCII range doesn't include letters in categories other than "upper" and "lower".
        return (latin[value] & (latinUpperMask | latinLowerMask)) != 0;
    }

    return IS_LETTER_EXP.test(String.fromCodePoint(value));
}

/**
 * Checks if the character at the specified index in the given string is a letter.
 *
 * @param value - The string to check.
 * @param index - The index of the character to check.
 * @returns `true` if the character at the specified index is a letter, `false` otherwise.
 *
 * @example
 * ```typescript
 * import { isLetterAt } from "@gnome/char";
 *
 * const str = "Hello, world!";
 * const index = 4;
 * const isLetter = isLetterAt(str, index);
 * console.log(isLetter); // Output: true
 *
 * const str1 = "Hello, 123!";
 * const index1 = 8;
 * const isLetter1 = isLetterAt(str1, index1);
 * console.log(isLetter1); // Output: false
 * ```
 */
export function isLetterAt(value: string, index: number): boolean {
    return isLetter(value.charCodeAt(index) as number);
}

/**
 * Checks if the character at the specified index in the given string is a UTF-16 letter.
 *
 * @param value - The string to check.
 * @param index - The index of the character to check.
 * @returns `true` if the character is a UTF-16 letter, `false` otherwise.
 *
 * ```typescript
 * import { isLetterUtf16At } from "@gnome/char";
 *
 * const str = "Hello, world!";
 * const index = 4;
 * const isLetter = isLetterUtf16At(str, index);
 * console.log(isLetter); // Output: true
 * ```
 */
export function isLetterUtf16At(value: string, index: number): boolean {
    return isLetter(value.codePointAt(index) as number);
}

/**
 * Checks if the given value represents a lowercase character.
 *
 * @param value - The value to check.
 * @returns `true` if the value represents a lowercase character, `false` otherwise.
 *
 * @example
 * ```typescript
 * import { isLower } from '@gnome/char';
 *
 * console.log(isLower(97)); // Output: true
 * console.log(isLower(65)); // Output: false
 * ```
 */
export function isLower(value: number): boolean {
    if (isLatin1(value)) {
        return (latin[value] & latinLowerMask) != 0;
    }

    if (!isLetter(value)) {
        return false;
    }

    return IS_LOWER_EXP.test(String.fromCharCode(value));
}

/**
 * Checks if the character at the specified index in the given string is a lowercase letter.
 *
 * @param value - The string to check.
 * @param index - The index of the character to check.
 * @returns `true` if the character is a lowercase letter, `false` otherwise.
 *
 * @example
 * ```typescript
 * import { isLowerAt } from "@gnome/char";
 *
 * const str = "Hello, world!";
 * const index = 4;
 * const isLower = isLowerAt(str, index);
 * console.log(isLower); // Output: false
 * ```
 */
export function isLowerAt(value: string, index: number): boolean {
    const code = value.charCodeAt(index) as number;

    if (isLatin1(code)) {
        return (latin[code] & latinLowerMask) != 0;
    }

    if (!isLetter(code)) {
        return false;
    }

    return IS_LOWER_EXP.test(value[index]);
}

/**
 * Checks if the given UTF-16 value represents a lowercase character.
 *
 * @param value - The UTF-16 value to check.
 * @returns `true` if the value represents a lowercase character, `false` otherwise.
 *
 * @example
 * ```typescript
 * import { isLowerUtf16 } from '@gnome/char';
 *
 * console.log(isLowerUtf16(97)); // Output: true
 * console.log(isLowerUtf16(65)); // Output: false
 * ```
 */
export function isLowerUtf16(value: number): boolean {
    if (!isLetter(value)) {
        return false;
    }

    if (isLatin1(value)) {
        const code = latin[value] as number;
        return (code & latinLowerMask) != 0;
    }

    return IS_LOWER_EXP.test(String.fromCodePoint(value));
}

/**
 * Checks if the character at the specified index in the given string is a lowercase UTF-16 character.
 *
 * @param value - The string to check.
 * @param index - The index of the character to check.
 * @returns `true` if the character is a lowercase UTF-16 character, `false` otherwise.
 *
 * @example
 * ```typescript
 * import { isLowerUtf16At } from "@gnome/char";
 *
 * const str = "Hello, world!";
 * const index = 4;
 * const isLower = isLowerUtf16At(str, index);
 * console.log(isLower); // Output: false
 * ```
 */
export function isLowerUtf16At(value: string, index: number): boolean {
    const code = value.codePointAt(index) as number;
    if (code === undefined) {
        return false;
    }

    if (!isLetter(code)) {
        return false;
    }

    if (isLatin1(code)) {
        return (latin[code] & latinLowerMask) != 0;
    }

    return IS_LOWER_EXP.test(String.fromCodePoint(code));
}

/**
 * Checks whether the given value is a letter or a digit.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a letter or a digit, `false` otherwise.
 *
 * @example
 * ```typescript
 * import { isLetterOrDigit } from '@gnome/char';
 *
 * console.log(isLetterOrDigit(65)); // Output: true
 * console.log(isLetterOrDigit(48)); // Output: true
 * console.log(isLetterOrDigit(33)); // Output: false
 * ```
 */
export function isLetterOrDigit(value: number): boolean {
    return isLetter(value) || isDigit(value);
}

/**
 * Checks whether the character at the specified index in the given string is a letter or digit.
 *
 * @param value - The string to check.
 * @param index - The index of the character to check.
 * @returns `true` if the character is a letter or digit, `false` otherwise.
 *
 * @example
 * ```typescript
 *
 * import { isLetterOrDigitAt } from "@gnome/char";
 *
 * const str = "Hello, 123!";
 * const index = 5;
 * const isLetterOrDigit = isLetterOrDigitAt(str, index);
 * console.log(isLetterOrDigit); // Output: true
 * console.log(isLetterOrDigitAt(str, 7)); // Output: true
 * ```
 */
export function isLetterOrDigitAt(value: string, index: number): boolean {
    return isLetterOrDigit(value.charCodeAt(index) as number);
}

/**
 * Checks whether the character at the specified index in the given string is a letter or a digit in UTF-16 encoding.
 *
 * @param value - The string to check.
 * @param index - The index of the character to check.
 * @returns `true` if the character is a letter or a digit, `false` otherwise.
 *
 * @example
 * ```typescript
 * import { isLetterOrDigitUtf16At } from "@gnome/char";
 *
 * const str = "Hello, 123!";
 * const index = 5;
 * const isLetterOrDigit = isLetterOrDigitUtf16At(str, index);
 * console.log(isLetterOrDigit); // Output: true
 */
export function isLetterOrDigitUtf16At(value: string, index: number): boolean {
    const code = value.codePointAt(index) as number;
    if (code === undefined) {
        return false;
    }

    return isDigit(code) || isLetter(code);
}

/**
 * Checks if the given value represents an uppercase character.
 *
 * @param value - The character value to check.
 * @returns `true` if the character is uppercase, `false` otherwise.
 *
 * @example
 * ```typescript
 * import { isUpper } from '@gnome/char';
 *
 * console.log(isUpper(65)); // Output: true
 * console.log(isUpper(97)); // Output: false
 * ```
 */
export function isUpper(value: number): boolean {
    if (isLatin1(value)) {
        const code = latin[value] as number;
        return (code & latinUpperMask) != 0;
    }

    if (!isLetter(value)) {
        return false;
    }

    return IS_UPPER_EXP.test(String.fromCodePoint(value));
}

/**
 * Checks if the character at the specified index in the given string is an uppercase letter.
 *
 * @param value - The string to check.
 * @param index - The index of the character to check.
 * @returns `true` if the character is an uppercase letter, `false` otherwise.
 *
 * @example
 * ```typescript
 * import { isUpperAt } from "@gnome/char";
 *
 * const str = "Hello, world!";
 * console.log(isUpperAt(str, 4)); // Output: false
 * console.log(isUpperAt(str, 0)); // Output: true
 * ```
 */
export function isUpperAt(value: string, index: number): boolean {
    const code = value.charCodeAt(index) as number;
    if (isLatin1(code)) {
        return (latin[code] & latinUpperMask) != 0;
    }

    if (!isLetter(code)) {
        return false;
    }

    return IS_UPPER_EXP.test(value[index]);
}

/**
 * Checks if the given UTF-16 value represents an uppercase character.
 *
 * @param value - The UTF-16 value to check.
 * @returns `true` if the value represents an uppercase character, `false` otherwise.
 *
 * @example
 * ```typescript
 * import { isUpperUtf16 } from '@gnome/char';
 *
 * console.log(isUpperUtf16(65)); // Output: true
 * console.log(isUpperUtf16(97)); // Output: false
 * ```
 */
export function isUpperUtf16(value: number): boolean {
    if (!isLetter(value)) {
        return false;
    }

    if (isLatin1(value)) {
        const code = latin[value] as number;
        return (code & latinUpperMask) != 0;
    }

    return IS_UPPER_EXP.test(String.fromCodePoint(value));
}

/**
 * Checks if the character at the specified index in the given string is an uppercase UTF-16 character.
 *
 * @param value - The string to check.
 * @param index - The index of the character to check.
 * @returns `true` if the character is an uppercase UTF-16 character, `false` otherwise.
 *
 * @example
 * ```typescript
 * import { isUpperUtf16At } from "@gnome/char";
 *
 * const str = "Hello, world!";
 * console.log(isUpperUtf16At(str, 4)); // Output: false
 * console.log(isUpperUtf16At(str, 0)); // Output: true
 * ```
 */
export function isUpperUtf16At(value: string, index: number): boolean {
    const code = value.codePointAt(index) as number;

    if (code === undefined) {
        return false;
    }

    if (!isLetter(code)) {
        return false;
    }

    if (isLatin1(code)) {
        return (latin[code] & latinUpperMask) != 0;
    }

    return IS_UPPER_EXP.test(String.fromCodePoint(code));
}

/**
 * Converts the given Unicode code point to its lowercase equivalent.
 * If the code point is already lowercase or non-letter, it returns the same value.
 * If the code point represents an uppercase letter, it converts it to lowercase.
 * If the code point represents a titlecase or uppercase letter with a specific locale,
 * it converts it to lowercase based on the specified locale.
 *
 * @param value - The Unicode code point to convert to lowercase.
 * @param locales - Optional. A string or an array of strings that specify the locale(s) to use for the conversion.
 *                  If not provided, the default locale of the JavaScript runtime is used.
 * @returns The lowercase equivalent of the given Unicode code point.
 *
 * @example
 * ```typescript
 * import { toLower } from '@gnome/char';
 *
 * console.log(toLower(65)); // Output: 97
 * console.log(toLower(97)); // Output: 97
 * console.log(toLower(48)); // Output: 48
 * ```
 */
export function toLower(value: number, locales?: string | string[]): number {
    if (value >= 65 && value <= 90) {
        return value + 32;
    }

    // already lower or non-letter
    if (value < 65 || (value >= 91 && value <= 191)) {
        return value;
    }

    const char = String.fromCharCode(value);
    if (IS_LOWER_EXP.test(char)) {
        return value;
    }

    return char.toLocaleLowerCase(locales).charCodeAt(0);
}

/**
 * Converts the given UTF-16 code unit to its lowercase equivalent.
 * If the code unit represents an uppercase letter, it is converted to lowercase.
 * If the code unit is already lowercase or a non-letter, it is returned as is.
 * If the code unit is not a valid Unicode character, undefined is returned.
 *
 * @param value - The UTF-16 code unit to convert.
 * @param locales - Optional. A string or an array of strings that specify the locale(s) to use for case conversion.
 * @returns The lowercase equivalent of the given code unit, or undefined if the code unit is not a valid Unicode character.
 *
 * @example
 * ```typescript
 * import { toLowerUtf16 } from '@gnome/char';
 *
 * console.log(toLowerUtf16(65)); // Output: 97
 * console.log(toLowerUtf16(97)); // Output: 97
 * console.log(toLowerUtf16(48)); // Output: 48
 * ```
 */
export function toLowerUtf16(value: number, locales?: string | string[]): number | undefined {
    if (value >= 65 && value <= 90) {
        return value + 32;
    }

    // already lower or non-letter
    if (value < 65 || (value >= 91 && value <= 191)) {
        return value;
    }

    const char = String.fromCodePoint(value);
    if (char === undefined) {
        return undefined;
    }

    if (IS_LOWER_EXP.test(char)) {
        return value;
    }

    return char.toLocaleLowerCase(locales).codePointAt(0);
}

/**
 * Converts a lowercase letter to uppercase.
 * If the input value is already uppercase or a non-letter, it returns the input value as is.
 * If the input value is a lowercase letter, it converts it to uppercase using the specified locales.
 * @param value - The Unicode value of the character to convert.
 * @param locales - Optional. A string or an array of strings that specify the locales to use for the conversion.
 * @returns The Unicode value of the uppercase character.
 *
 * @example
 * ```typescript
 * import { toUpper } from '@gnome/char';
 *
 * console.log(toUpper(65)); // Output: 65
 * console.log(toUpper(97)); // Output: 65
 * console.log(toUpper(48)); // Output: 48
 * ```
 */
export function toUpper(value: number, locales?: string | string[]): number {
    if (value >= 97 && value <= 122) {
        return value - 32;
    }

    // already upper or non-letter
    if (value < 97 || (value >= 123 && value <= 191)) {
        return value;
    }

    const char = String.fromCharCode(value);
    if (IS_UPPER_EXP.test(char)) {
        return value;
    }

    return char.toLocaleUpperCase(locales).charCodeAt(0);
}

/**
 * Converts a UTF-16 character code to its uppercase equivalent.
 *
 * @param value - The UTF-16 character code to convert.
 * @param locales - Optional. A string or an array of strings that specify the locale(s) to use for case conversion.
 * @returns The uppercase equivalent of the input character code, or the input character code itself if it is already uppercase or non-letter.
 *
 * @example
 * ```typescript
 * import { toUpperUtf16 } from '@gnome/char';
 *
 * console.log(toUpperUtf16(65)); // Output: 65
 * console.log(toUpperUtf16(97)); // Output: 65
 * console.log(toUpperUtf16(48)); // Output: 48
 * ```
 */
export function toUpperUtf16(value: number, locales?: string | string[]): number | undefined {
    if (value >= 97 && value <= 122) {
        return value - 32;
    }

    // already upper or non-letter
    if (value < 97 || (value >= 123 && value <= 191)) {
        return value;
    }

    if (isUpperUtf16(value)) {
        return value;
    }

    return String.fromCodePoint(value).toLocaleUpperCase(locales).codePointAt(0);
}

/**
 * Checks if the given character is a whitespace character.
 *
 * @param value - The character to check.
 * @returns `true` if the character is a whitespace character, `false` otherwise.
 */
export function isWhiteSpace(value: number): boolean {
    return (latin[value] & whitespaceFlag) != 0 || value === 65279;
}

/**
 * Checks if the character at the specified index in the given string is a whitespace character.
 *
 * @param value - The string to check.
 * @param index - The index of the character to check.
 * @returns `true` if the character is a whitespace character, `false` otherwise.
 *
 * @example
 * ```typescript
 * import { isWhiteSpaceAt } from "@gnome/char";
 *
 * const str = "Hello, world!";
 * console.log(isWhiteSpaceAt(str, 4)); // Output: false
 * console.log(isWhiteSpaceAt(str, 6)); // Output: true
 */
export function isWhiteSpaceAt(value: string, index: number): boolean {
    const code = value.charCodeAt(index) as number;
    return (latin[code] & whitespaceFlag) != 0 || code === 65279;
}
