/**
 * Checks if a character at the specified index is a whitespace character.
 *
 * @param str - The input string.
 * @param index - The index of the character to check.
 * @returns `true` if the character at the specified index is a whitespace character, `false` otherwise.
 */
import { isWhiteSpaceAt } from "@gnome/char";

/**
 * An empty string constant.
 */
export const EMPTY = "";

/**
 * Splits a string into an array of substrings based on a specified separator.
 *
 * @param str - The input string or Uint8Array.
 * @param separator - The separator string or regular expression.
 * @param trim - Optional. Specifies whether to trim the resulting substrings. Defaults to `false`.
 * @param limit - Optional. The maximum number of substrings to return.
 * @returns An array of substrings.
 */
export function split(
    str: string | Uint8Array,
    separator: string | RegExp,
    trim = false,
    limit?: number,
): string[] {
    if (str instanceof Uint8Array) {
        str = new TextDecoder().decode(str);
    }

    const result = str.split(separator, limit);
    if (trim) {
        return result.map((x) => x.trim()).filter((x) => x.length > 0);
    }

    return result;
}

/**
 * Removes trailing whitespace characters from a string.
 *
 * @param str - The input string.
 * @param chars - Optional. The characters to remove. Defaults to an empty string.
 * @returns The string with trailing whitespace characters removed.
 */
export function trimEnd(str: string, chars: string = EMPTY): string {
    let size = str.length;

    if (chars === EMPTY) {
        for (let i = str.length - 1; i >= 0; i--) {
            if (isWhiteSpaceAt(str, i)) {
                size--;
            } else {
                break;
            }
        }

        if (size === str.length) {
            return str;
        }

        return str.substring(0, size);
    }

    if (chars.length === 1) {
        const c = chars.charCodeAt(0);
        for (let i = str.length - 1; i >= 0; i--) {
            if (str.charCodeAt(i) === c) {
                size--;
            } else {
                break;
            }
        }

        if (size === str.length) {
            return str;
        }

        return str.substring(0, size);
    }

    const codes = toCharCodeArray(chars);

    for (let i = str.length - 1; i >= 0; i--) {
        if (codes.includes(str.charCodeAt(i))) {
            size--;
            continue;
        } else {
            break;
        }
    }

    if (size === str.length) {
        return str;
    }

    if (size === 0) {
        return EMPTY;
    }

    return str.substring(0, size);
}

/**
 * Finds the index of the first occurrence of a substring in a string, ignoring case.
 *
 * @param str - The input string.
 * @param search - The substring to search for.
 * @param start - Optional. The starting index of the search. Defaults to 0.
 * @param locales - Optional. The locale(s) to use for the comparison.
 * @returns The index of the first occurrence of the substring, or -1 if not found.
 */
export function indexOfIgnoreCase(
    str: string,
    search: string,
    start = 0,
    locales?: string | string[],
): number {
    const searchLen = search.length;
    const strLen = str.length;

    if (strLen === 0 || searchLen === 0 || searchLen > strLen) {
        return -1;
    }

    let i = start;
    while (i <= strLen - searchLen) {
        let j = 0;
        while (
            j < searchLen &&
            str[i + j].localeCompare(search[j], locales, {
                    sensitivity: "accent",
                }) === 0
        ) {
            j++;
        }
        if (j === searchLen) {
            return i;
        }
        i++;
    }
    return -1;
}

/**
 * Checks if a string starts with a specified substring, ignoring case.
 *
 * @param str - The input string.
 * @param search - The substring to search for.
 * @param start - Optional. The starting index of the search. Defaults to 0.
 * @param locales - Optional. The locale(s) to use for the comparison.
 * @returns `true` if the string starts with the specified substring, `false` otherwise.
 */
export function startsWithIgnoreCase(
    str: string,
    search: string,
    start = 0,
    locales?: string | string[],
): boolean {
    const searchLen = search.length;
    const strLen = str.length;

    if (strLen === 0 || searchLen === 0 || searchLen > strLen) {
        return false;
    }

    const i = start;
    let j = 0;
    while (
        j < searchLen &&
        str[i + j].localeCompare(search[j], locales, {
                sensitivity: "accent",
            }) === 0
    ) {
        j++;
    }
    return j === searchLen;
}

/**
 * Checks if a string ends with a specified substring, ignoring case.
 *
 * @param str - The input string.
 * @param search - The substring to search for.
 * @param end - Optional. The ending index of the search. Defaults to the length of the string.
 * @param locales - Optional. The locale(s) to use for the comparison.
 * @returns `true` if the string ends with the specified substring, `false` otherwise.
 */
export function endsWithIgnoreCase(
    str: string,
    search: string,
    end?: number,
    locales?: string | string[],
): boolean {
    const searchLen = search.length;
    const strLen = str.length;
    end = end ?? strLen;
    end = Math.min(end, strLen);

    if (strLen === 0 || searchLen === 0 || searchLen > strLen) {
        return false;
    }

    if (searchLen == 0) {
        return str[strLen - 1].localeCompare(search[0], locales, {
            sensitivity: "accent",
        }) === 0;
    }

    const i = end - searchLen;

    let j = 0;
    while (
        j < searchLen &&
        str[i + j].localeCompare(search[j], locales, {
                sensitivity: "accent",
            }) === 0
    ) {
        j++;
    }
    return j === searchLen;
}

/**
 * Removes leading whitespace characters from a string.
 *
 * @param str - The input string.
 * @param chars - Optional. The characters to remove. Defaults to an empty string.
 * @returns The string with leading whitespace characters removed.
 */
export function trimStart(str: string, chars: string = EMPTY): string {
    let size = str.length;

    if (chars === EMPTY) {
        for (let i = 0; i < str.length; i++) {
            if (isWhiteSpaceAt(str, i)) {
                size--;
            } else {
                break;
            }
        }

        if (size === str.length) {
            return str;
        }

        return str.substring(str.length - size);
    }

    if (chars.length === 1) {
        const c = chars.charCodeAt(0);
        for (let i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) === c) {
                size--;
            } else {
                break;
            }
        }

        if (size === str.length) {
            return str;
        }

        return str.substring(str.length - size);
    }

    let j = 0;
    const codes = toCharCodeArray(chars);
    for (let i = 0; i < str.length; i++) {
        if (codes.includes(str.charCodeAt(i))) {
            j++;
            size--;
        } else {
            break;
        }
    }

    if (size === str.length) {
        return str;
    }

    return str.substring(j);
}

/**
 * Removes leading and trailing whitespace characters from a string.
 *
 * @param str - The input string.
 * @param chars - Optional. The characters to remove. Defaults to an empty string.
 * @returns The string with leading and trailing whitespace characters removed.
 */
export function trim(str: string, chars: string = EMPTY): string {
    return trimEnd(trimStart(str, chars), chars);
}

/**
 * Checks if two strings are equal, ignoring case.
 *
 * @param left - The first string to compare.
 * @param right - The second string to compare.
 * @param locales - Optional. The locale(s) to use for the comparison.
 * @returns `true` if the strings are equal, `false` otherwise.
 */
export function equalsIgnoreCase(
    left?: string | null,
    right?: string | null,
    locales?: string | string[],
): boolean {
    if (left === right) {
        return true;
    }

    if (left === undefined || right === undefined) {
        return false;
    }

    if (left === null || right === null) {
        return false;
    }

    return left.localeCompare(right, locales, { sensitivity: "accent" }) === 0;
}

/**
 * Checks if a string includes a specified substring, ignoring case.
 *
 * @param str - The input string.
 * @param search - The substring to search for.
 * @param start - Optional. The starting index of the search. Defaults to 0.
 * @param locales - Optional. The locale(s) to use for the comparison.
 * @returns `true` if the string includes the specified substring, `false` otherwise.
 */
export function includesIgnoreCase(
    str: string,
    search: string,
    start = 0,
    locales?: string | string[],
): boolean {
    const searchLen = search.length;
    const strLen = str.length;
    let i = start;
    while (i <= strLen - searchLen) {
        let j = 0;
        while (
            j < searchLen &&
            str[i + j].localeCompare(search[j], locales, {
                    sensitivity: "accent",
                }) === 0
        ) {
            j++;
        }
        if (j === searchLen) {
            return true;
        }
        i++;
    }
    return false;
}

/**
 * Converts a string to an array of characters.
 *
 * @param str - The input string.
 * @returns An array of characters.
 */
export function toCharacterArray(str: string): string[] {
    return str.split("");
}

/**
 * Converts a string to an array of character codes.
 *
 * @param str - The input string.
 * @returns An array of character codes.
 */
export function toCharCodeArray(str: string): Uint8Array {
    const set = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
        set[i] = str.charCodeAt(i);
    }

    return set;
}

/**
 * Converts a string to an array of Unicode code points.
 *
 * @param str - The input string.
 * @returns An array of Unicode code points.
 */
export function toCodePointArray(str: string): number[] {
    const set: number[] = [];
    for (let i = 0; i < str.length; i++) {
        const code = str.codePointAt(i);
        if (code) {
            set.push(code);
        }
    }

    return set;
}

/**
 * Checks if a string consists only of whitespace characters.
 *
 * @param str - The input string.
 * @returns `true` if the string consists only of whitespace characters, `false` otherwise.
 */
export function isWhiteSpace(str: string): boolean {
    for (let i = 0; i < str.length; i++) {
        if (!isWhiteSpaceAt(str, i)) {
            return false;
        }
    }

    return true;
}

/**
 * Checks if a string is `null`, `undefined`, or consists only of whitespace characters.
 *
 * @param str - The input string.
 * @returns `true` if the string is `null`, `undefined`, or consists only of whitespace characters, `false` otherwise.
 */
export function isNullOrWhiteSpace(str: string | null | undefined): boolean {
    if (str === null || str === undefined) {
        return true;
    }

    return isWhiteSpace(str);
}

/**
 * Checks if a string is `null`, `undefined`, or empty.
 *
 * @param str - The input string.
 * @returns `true` if the string is `null`, `undefined`, or empty, `false` otherwise.
 */
export function isNullOrEmpty(str: string | null | undefined): boolean {
    if (str === null || str === undefined) {
        return true;
    }

    return str.length === 0;
}
