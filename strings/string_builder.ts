import { WINDOWS } from "@gnome/os-constants";
import { ArgumentRangeError, NotSupportedError } from "@gnome/errors";

/**
 * Represents a string builder that allows efficient string concatenation.
 */
export class StringBuilder {
    #buffer: Uint8Array;
    #length: number;

    /**
     * Creates a new instance of the StringBuilder class.
     * @param capacity The initial capacity of the string builder. Default is 16.
     */
    constructor(capacity = 16) {
        this.#length = 0;
        this.#buffer = new Uint8Array(capacity);
    }

    /**
     * Gets the current length of the string builder.
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
     * Gets the character at the specified index.
     * @param index The index of the character to retrieve.
     * @returns The character at the specified index.
     */
    at(index: number): number {
        return this.#buffer[index];
    }

    /**
     * Clears the string builder by resetting its length to zero.
     *
     * @returns {this} The string builder instance.
     */
    clear(): this {
        this.#length = 0;
        return this;
    }

    /**
     * Returns a new Uint8Array that contains a portion of the string builder.
     * @param start The starting index. Default is 0.
     * @param end The ending index. Default is the length of the string builder.
     * @returns A new Uint8Array that contains the specified portion of the string builder.
     */
    slice(start?: number, end?: number): Uint8Array {
        return this.#buffer.slice(start, end);
    }

    /**
     * Sets the character at the specified index.
     * @param index The index of the character to set.
     * @param value The new value of the character.
     * @returns The updated string builder.
     */
    set(index: number, value: number): this {
        this.#buffer[index] = value;
        return this;
    }

    /**
     * Copies a portion of the string builder to a target Uint8Array.
     * @param target The target Uint8Array to copy to.
     * @param targetIndex The starting index in the target array. Default is 0.
     * @param sourceIndex The starting index in the string builder. Default is 0.
     * @param length The number of elements to copy. Default is the length of the string builder.
     * @returns The updated string builder.
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
     * Appends a value to the string builder.
     * @param value The value to append.
     * @returns The updated string builder.
     * @throws NotSupportedError if the value is a function.
     */
    append(value: unknown): this {
        if (value === undefined || value === null) {
            return this;
        }

        if (value instanceof Uint8Array) {
            return this.appendUint8Array(value);
        }

        if (value instanceof StringBuilder) {
            return this.appendBuilder(value);
        }

        if (typeof value === "function") {
            throw new NotSupportedError("Function not supported");
        }

        return this.appendString(value.toString());
    }

    /**
     * Appends the contents of another StringBuilder to the string builder.
     * @param value The StringBuilder to append.
     * @returns The updated string builder.
     */
    appendBuilder(value: StringBuilder): this {
        this.appendUint8Array(value.#buffer.slice(0, value.#length));
        return this;
    }

    /**
     * Appends a string to the string builder.
     * @param value The string to append.
     * @returns The updated string builder.
     */
    appendString(value: string): this {
        this.grow(this.#length + value.length);
        for (let i = 0; i < value.length; i++) {
            this.#buffer[this.#length++] = value.charCodeAt(i);
        }

        return this;
    }

    /**
     * Appends a Uint8Array to the string builder.
     * @param value The Uint8Array to append.
     * @returns The updated string builder.
     */
    appendUint8Array(value: Uint8Array): this {
        this.grow(this.#length + value.length);
        this.#buffer.set(value, this.#length);
        this.#length += value.length;

        return this;
    }

    /**
     * Appends a numeric code to the string builder.
     * @param code The numeric code to append.
     * @returns The updated string builder.
     */
    appendCode(code: number): this {
        this.grow(this.#length + 1);
        this.#buffer[this.#length++] = code;
        return this;
    }

    /**
     * Appends a character to the string builder.
     * @param char The character to append.
     * @returns The updated string builder.
     */
    appendChar(char: string): this {
        this.grow(this.#length + 1);
        this.#buffer[this.#length++] = char.charCodeAt(0);
        return this;
    }

    /**
     * Appends a string followed by a line break to the string builder.
     * @param value The string to append.
     * @returns The updated string builder.
     */
    appendLine(value: string): this {
        if (value.length > 0) {
            this.appendString(value);
        }

        if (WINDOWS) {
            this.appendCode(13);
        }
        this.appendCode(10);

        return this;
    }

    /**
     * Shrinks the capacity of the string builder to the specified value.
     * @param capacity The new capacity of the string builder.
     * @returns The updated StringBuilder instance.
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
     * @returns The updated StringBuilder instance.
     */
    trimExcess(): this {
        this.shrinkTo(this.#length);
        return this;
    }

    toString(): string {
        return String.fromCharCode(...this.#buffer.slice(0, this.#length));
    }

    /**
     * Increases the capacity of the string builder, if necessary, to accommodate the specified capacity.
     * @param capacity The minimum capacity to ensure.
     * @private
     */
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
