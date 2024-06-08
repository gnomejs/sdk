/**
 * Represents a builder for creating UTF-8 encoded strings.
 */
import { ArgumentRangeError, NotSupportedError } from "@gnome/errors";
import { WINDOWS } from "@gnome/os-constants";

/**
 * Represents a builder for creating UTF-8 encoded strings.
 */
export class Utf8StringBuilder {
    #buffer: Uint8Array;
    #length: number;
    #encoder: TextEncoder;

    /**
     * Constructs a new instance of the Utf8StringBuilder class.
     * @param capacity The initial capacity of the string builder. Defaults to 16.
     */
    constructor(capacity = 16) {
        this.#length = 0;
        this.#buffer = new Uint8Array(capacity);
        this.#encoder = new TextEncoder();
    }

    /**
     * Creates a new Utf8StringBuilder instance from a string.
     * @param value The string value to initialize the builder with.
     * @returns A new Utf8StringBuilder instance.
     */
    static fromString(value: string): Utf8StringBuilder {
        const builder = new Utf8StringBuilder(value.length);
        builder.appendString(value);
        return builder;
    }

    /**
     * Creates a new Utf8StringBuilder instance from a Uint8Array.
     * @param value The Uint8Array value to initialize the builder with.
     * @returns A new Utf8StringBuilder instance.
     */
    static fromUint8Array(value: Uint8Array): Utf8StringBuilder {
        const builder = new Utf8StringBuilder(value.length);
        builder.appendUtf8Array(value);
        return builder;
    }

    /**
     * Gets the length of the string builder.
     * @returns The length of the string builder.
     */
    get length(): number {
        return this.#length;
    }

    /**
     * Sets the length of the string builder.
     * @param value The new length of the string builder.
     * @private
     */
    protected set length(value: number) {
        this.#length = value;
    }

    /**
     * Gets the byte at the specified index in the string builder.
     * @param index The index of the byte to retrieve.
     * @returns The byte value at the specified index.
     */
    at(index: number): number {
        return this.#buffer[index];
    }

    /**
     * Returns a new Uint8Array that contains a portion of the string builder.
     * @param start The starting index of the slice. Defaults to 0.
     * @param end The ending index of the slice. Defaults to the length of the string builder.
     * @returns A new Uint8Array containing the sliced portion of the string builder.
     */
    slice(start?: number, end?: number): Uint8Array {
        return this.#buffer.slice(start, end);
    }

    /**
     * Sets the byte at the specified index in the string builder.
     * @param index The index of the byte to set.
     * @param value The byte value to set.
     * @returns The updated Utf8StringBuilder instance.
     */
    set(index: number, value: number): this {
        this.#buffer[index] = value;
        return this;
    }

    /**
     * Copies a portion of the string builder to a target Uint8Array.
     * @param target The target Uint8Array to copy the data to.
     * @param targetIndex The starting index in the target array to copy the data to. Defaults to 0.
     * @param sourceIndex The starting index in the string builder to copy the data from. Defaults to 0.
     * @param length The number of bytes to copy. Defaults to the length of the string builder.
     * @returns The updated Utf8StringBuilder instance.
     * @throws ArgumentRangeError if the targetIndex, sourceIndex, or length is out of range.
     */
    copyTo(
        target: Uint8Array,
        targetIndex = 0,
        sourceIndex = 0,
        length: number = this.#length,
    ): this {
        if (targetIndex < 0 || targetIndex >= target.length) {
            throw new ArgumentRangeError(
                "targetIndex",
                `Argument 'targetIndex' must be greater than -1 less than the length of the target array.`,
            );
        }

        if (sourceIndex < 0 || sourceIndex >= this.#length) {
            throw new ArgumentRangeError(
                "sourceIndex",
                `Argument 'sourceIndex' must be greater than -1 less than the length of the source array.`,
            );
        }

        if (length < 0 || length > this.#length - sourceIndex) {
            throw new ArgumentRangeError(
                "length",
                `Argument 'length' must be greater than -1 less than the length of the source array.`,
            );
        }

        target.set(this.#buffer.slice(sourceIndex, length), targetIndex);
        return this;
    }

    /**
     * Appends a new line to the string builder.
     * @param value The value to append before the new line. Defaults to undefined.
     * @returns The updated Utf8StringBuilder instance.
     */
    appendLine(value?: unknown): this {
        if (value !== undefined && value !== null) {
            this.append(value);
        }

        if (WINDOWS) {
            this.grow(this.length + 2);
            this.#buffer[this.length] = 13;
            this.#buffer[this.length + 1] = 10;
            this.length += 2;
            return this;
        }

        return this.appendUtf8Char(10);
    }

    /**
     * Appends a UTF-8 character to the string builder.
     * @param value The UTF-8 character to append.
     * @returns The updated Utf8StringBuilder instance.
     */
    appendUtf8Char(value: number): this {
        this.grow(this.length + 1);
        this.#buffer[this.length] = value;
        this.length++;

        return this;
    }

    /**
     * Appends a character to the string builder.
     * @param value The character to append.
     * @returns The updated Utf8StringBuilder instance.
     * @throws ArgumentRangeError if the value is not a single character.
     */
    appendChar(value: string): this {
        if (value.length !== 1) {
            throw new ArgumentRangeError("value", "Argument 'value' must be a single character.");
        }

        return this.appendUtf16Char(value.charCodeAt(0));
    }

    appendUtf16Array(value: Uint8Array): this {
        for (let i = 0; i < value.length; i += 2) {
            this.appendUtf16Char(value[i]);
        }

        return this;
    }

    /**
     * Appends a UTF-16 character to the string builder.
     * @param value The UTF-16 character to append.
     * @returns The updated Utf8StringBuilder instance.
     */
    appendUtf16Char(value: number): this {
        if (value < 0x80) {
            this.grow(this.length + 1);
            this.#buffer[this.length] = value;
            this.length++;
            return this;
        }

        if (value < 0x800) {
            this.grow(this.length + 2);
            this.#buffer[this.length] = 0xc0 | (value >> 6);
            this.#buffer[this.length + 1] = 0x80 | (value & 0x3f);
            this.length += 2;
            return this;
        }

        if (value < 0xd800 || value >= 0xe000) {
            this.grow(this.length + 3);
            this.#buffer[this.length] = 0xe0 | (value >> 12);
            this.#buffer[this.length + 1] = 0x80 | ((value >> 6) & 0x3f);
            this.#buffer[this.length + 2] = 0x80 | (value & 0x3f);
            this.length += 3;
            return this;
        }

        let charcode = value;
        charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (value & 0x3ff));
        this.grow(this.length + 4);
        this.#buffer[this.length] = 0xf0 | (charcode >> 18);
        this.#buffer[this.length + 1] = 0x80 | ((charcode >> 12) & 0x3f);
        this.#buffer[this.length + 2] = 0x80 | ((charcode >> 6) & 0x3f);
        this.#buffer[this.length + 3] = 0x80 | (charcode & 0x3f);
        this.length += 4;
        return this;
    }

    /**
     * Appends the contents of another Utf8StringBuilder to the string builder.
     * @param value The Utf8StringBuilder to append.
     * @returns The updated Utf8StringBuilder instance.
     */
    appendBuilder(value: Utf8StringBuilder): this {
        return this.appendUtf8Array(value.#buffer.slice(0, value.#length));
    }

    /**
     * Appends a string to the string builder.
     * @param value The string to append.
     * @returns The updated Utf8StringBuilder instance.
     */
    appendString(value: string): this {
        return this.appendUtf8Array(this.#encoder.encode(value));
    }

    /**
     * Appends a Uint8Array to the string builder assuming the
     * values are Utf8.
     * @param value The Uint8Array to append.
     * @returns The updated Utf8StringBuilder instance.
     */
    appendUtf8Array(value: Uint8Array): this {
        this.grow(this.#length + value.length);
        this.#buffer.set(value, this.#length);
        this.#length += value.length;
        return this;
    }

    /**
     * Appends a value to the string builder.
     * @param value The value to append.
     * @returns The updated Utf8StringBuilder instance.
     * @throws NotSupportedError if the value is a function.
     */
    append(value: unknown): this {
        if (value === undefined || value === null) {
            return this;
        }

        if (value instanceof Uint8Array) {
            return this.appendUtf8Array(value);
        }

        if (value instanceof Utf8StringBuilder) {
            return this.appendBuilder(value);
        }

        if (typeof value === "function") {
            throw new NotSupportedError("Function not supported");
        }

        return this.appendString(value.toString());
    }

    /**
     * Clears the contents of the string builder.
     * @returns The updated Utf8StringBuilder instance.
     */
    clear(): this {
        this.#buffer.fill(0);
        this.#length = 0;
        return this;
    }

    /**
     * Shrinks the capacity of the string builder to the specified value.
     * @param capacity The new capacity of the string builder.
     * @returns The updated Utf8StringBuilder instance.
     * @throws ArgumentRangeError if the capacity is less than 0.
     */
    shrinkTo(capacity: number): this {
        if (capacity < 0) {
            throw new ArgumentRangeError(
                "capacity",
                `Argument 'capacity' must be greater than -1.`,
            );
        }

        this.#buffer = this.#buffer.slice(0, capacity);
        return this;
    }

    /**
     * Trims excess capacity from the string builder.
     * @returns The updated Utf8StringBuilder instance.
     */
    trimExcess(): this {
        this.shrinkTo(this.#length);
        return this;
    }

    /**
     * Returns the contents of the string builder as a Uint8Array.
     * @returns A Uint8Array containing the contents of the string builder.
     */
    toArray(): Uint8Array {
        return this.#buffer.slice(0, this.#length);
    }

    /**
     * Returns the contents of the string builder as a string.
     * @returns A string representation of the contents of the string builder.
     */
    toString(): string {
        return new TextDecoder().decode(this.#buffer.slice(0, this.#length));
    }

    private grow(capacity: number): this {
        if (capacity <= this.#buffer.length) {
            return this;
        }

        capacity = Math.max(capacity, this.#buffer.length * 2);
        const newBuffer = new Uint8Array(capacity);
        newBuffer.set(this.#buffer);
        this.#buffer = newBuffer;
        return this;
    }
}
