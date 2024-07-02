/**
 * Converts an ArrayBuffer to a string using UTF-16 encoding. This is
 * useful for converting to PWSTR strings for Windows FFI.
 *
 * @param buffer - The ArrayBuffer to convert.
 * @returns The converted string.
 */
export function toPwstr(buffer: ArrayBuffer): string {
    const view = new DataView(buffer);
    const codes: number[] = [];
    for (let i = 0; i < view.byteLength; i += 2) {
        codes.push(view.getUint16(i, true));
    }

    return new TextDecoder("utf-16le").decode(new Uint16Array(codes));
}

/**
 * Converts a string or Uint8Array to a Uint8Array representation of a null-terminated wide string (PWStr).
 * If the input value is already a Uint8Array, it is returned as is.
 * If the input value is a string, it is encoded as UTF-16LE and converted to a Uint8Array.
 * If the input value is null or undefined, a Uint8Array containing a single null byte (0x0) is returned.
 *
 * @param value - The value to convert to a Uint8Array representation of a PWStr.
 * @returns A Uint8Array representation of the input value as a PWStr.
 */
export function fromPwstr(value?: string | null | Uint8Array | Uint16Array): Uint8Array {
    if (value === null || value === undefined) {
        return new Uint8Array([0x0]);
    }

    if (typeof value === "string") {
        return new Uint8Array(
            new Uint16Array(new TextEncoder().encode(value + "\0")).buffer,
        );
    }

    if (value instanceof Uint8Array) {
        return value;
    }

    return new Uint8Array(value.buffer);
}

/**
 * Converts a C-style string to a Uint8Array.
 *
 * @param value - The C-style string to convert.
 * @returns The converted Uint8Array.
 */
export function fromCString(value?: string | null | Uint8Array): Uint8Array {
    if (value === null || value === undefined) {
        return new Uint8Array([0x0]);
    }

    if (typeof value === "string") {
        return new Uint8Array(
            new TextEncoder().encode(value + "\0"),
        );
    }

    return value;
}

/**
 * Converts a character to its corresponding Unicode code point.
 * If the input is a string, it returns the code point of the first character.
 * If the input is a number, it returns the same number.
 *
 * @param c - The character or number to convert.
 * @returns The Unicode code point of the character or the same number if it's already a number.
 */
export function fromChar(c: string | number): number {
    return typeof c === "number" ? c : c.charCodeAt(0);
}

/**
 * Converts a number to its corresponding character.
 *
 * @param c - The number to convert.
 * @returns The character representation of the number.
 */
export function toChar(c: number): string {
    return String.fromCharCode(c);
}

/**
 * Converts a number to a boolean value.
 * @param value - The number to convert.
 * @returns The boolean value.
 */
export function toBool(value: number): boolean {
    return value !== 0;
}

/**
 * Converts a boolean value to a number.
 * @param value The boolean value to convert.
 * @returns The converted number. Returns 1 if the value is true, 0 if the value is false.
 */
export function fromBool(value: boolean): number {
    return value ? 1 : 0;
}

/**
 * Represents a native library.
 */
export interface NativeLibrary {
    /**
     * Closes the native library.
     */
    close(): void;

    /**
     * Disposes the native library.
     */
    [Symbol.dispose](): void;
}
