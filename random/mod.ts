/**
 * ## Overview
 * 
 * A module for generating random values.
 * 
 * - `randomUUID()` - creates a random universal unique identifier.
 * - `getRandomValues()` - creates random values for the given array.
 * - `randomBytes()` - creates a Uint8Array with random values (bytes) for the
 *   given length using a cryptographically secure random number generator (CSRNG).
 * - `randomFileName()` - creates a random file name with the given length
 *    using CSRNG.
 * 
 * ## Basic Usage
 * 
 * ```typescript
 * import { randomBytes, randomFileName } from "@gnome/assert";
 * 
 * // returns a Uint8Array filled with random bytes
 * console.log(randomBytes(32)) 
 * 
 * // return a file name that starts with tmp_ followed by
 * // 15 random characters.
 * console.log(randomFileName(15, 'tmp_')) 
 * ```
 * 
 * [MIT License](./LICENSE.md)
 * 
 */

/**
 * Generates cryptographically secure random values for the given array.
 *
 * @param array - The array to fill with random values.
 * @returns The same array filled with random values.
 *
 * @example
 * ```ts
 * import { getRandomValues } from "@gnome/random";
 *
 * const array = new Uint8Array(4);
 * getRandomValues(array);
 * console.log(array);
 * ```
 */
export function getRandomValues<
    T extends
        | Int8Array
        | Int16Array
        | Int32Array
        | Uint8Array
        | Uint16Array
        | Uint32Array
        | Uint8ClampedArray
        | BigInt64Array
        | BigUint64Array,
>(array: T): T {
    return globalThis.crypto.getRandomValues(array);
}

/**
 * Generates a random UUID (Universally Unique Identifier).
 *
 * @returns A string representing the generated UUID.
 * @example
 * ```ts
 * import { randomUUID } from "@gnome/random";
 *
 * const uuid = randomUUID();
 * console.log(uuid);
 * ```
 */
export function randomUUID(): string {
    return globalThis.crypto.randomUUID();
}

/**
 * Generates an array of random bytes.
 *
 * @param length - The length of the array to generate.
 * @returns An array of random bytes.
 *
 * @example
 * ```ts
 * import { randomBytes } from '@gnome/random'
 *
 * const bytes = randomBytes(32); // u8[]
 * console.log(bytes);
 * ```
 */
export function randomBytes(length: number): Uint8Array {
    const buffer = new Uint8Array(length);
    getRandomValues(buffer);
    return buffer;
}

/**
 * Generates a random file name of the specified length using the provided characters.
 * If no characters are provided, the default set of characters will be used. It
 * does not include the file extension.
 *
 * @param length - The length of the file name (default: 12).
 * @param characters - The characters to use for generating the file name (default: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-").
 * @param prefix - The prefix to add to the file name.
 * @returns A random file name.
 *
 * @example
 * ```ts
 * import { randomFileName } from "@gnome/random";
 *
 * const fileName = randomFileName();
 * console.log(fileName);
 * ```
 */
export function randomFileName(length = 12, prefix?: string, characters?: string): string {
    // useful for generating as password that can be cleared from memory
    // as strings are immutable in javascript
    const chars: Uint8Array = new Uint8Array(length);

    const codePoints: number[] = [];
    characters ??= "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-";
    if (characters && characters.length > 1) {
        for (let i = 0; i < characters.length; i++) {
            codePoints.push(characters.codePointAt(i)!);
        }
    }

    chars.fill(0);
    const bytes = randomBytes(12);

    for (let i = 0; i < length; i++) {
        const bit = Math.abs(bytes[i]) % codePoints.length;
        chars[i] = codePoints[bit];
    }

    if (prefix && prefix.length > 0) {
        return `${prefix}${String.fromCodePoint(...chars)}`;
    }

    return String.fromCodePoint(...chars);
}
