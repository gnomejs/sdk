import { toCharSliceLike } from "./to_char_array.ts";
import type { CharSliceLike } from "./types.ts";
import { toLower, toUpper } from "@gnome/chars";

export interface CapitalizeOptions {
    /**
     * Preserve the case of the characters that are not
     * the first character.
     */
    preserveCase?: boolean;
}

/**
 * Capitalize converts the first character of a string to uppercase. By default, it
 * converts the first character to uppercase and the rest to lowercase.
 *
 * @description
 * To avoid allocations, the function returns a Uint32Array that represents
 * the capitalized string.  To convert the Uint32Array to a string, use
 * `String.fromCharCode(...capitalized)`.
 *
 * @param value The string to capitalize.
 * @param options The options for the function.
 * @returns The capitalized string as a Uint32Array.
 */
export function capitalize(value: CharSliceLike | string, options?: CapitalizeOptions): Uint32Array {
    if (typeof value === "string") {
        value = toCharSliceLike(value);
    }

    options ??= {};

    const buffer = new Uint32Array(value.length);
    if (value instanceof Uint32Array) {
        buffer.set(value);
        buffer[0] = toUpper(buffer[0]);
        return buffer;
    }

    for (let i = 0; i < value.length; i++) {
        const r = value.at(i);
        if (r === undefined) {
            buffer[i] = 0;
            continue;
        }
        if (i === 0) {
            buffer[i] = toUpper(r);
            continue;
        }

        if (options.preserveCase) {
            buffer[i] = r;
            continue;
        }

        buffer[i] = toLower(r);
    }

    return buffer;
}
