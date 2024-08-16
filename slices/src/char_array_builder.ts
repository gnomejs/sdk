import { ArgumentRangeError } from "@gnome/errors/argument-range-error";
import { WINDOWS  } from "@gnome/runtime-info/os";
import { CharSlice } from "./char_slice.ts";
import { toCharArray } from "./to_char_array.ts"
import { sprintf } from "@std/fmt/printf";
import { ArgumentError } from "../../errors/src/argument_error.ts";

export class CharArrayBuilder {
    #buffer: Uint32Array
    #length: number 

    /**
     * Creates a new instance of the StringBuilder class.
     * @param capacity The initial capacity of the string builder. Default is 16.
     */
    constructor(capacity = 16) {
        this.#length = 0;
        this.#buffer = new Uint32Array(capacity);
    }

    get length() {
        return this.#length;
    }

    appendFormat(template: string, ...args: unknown[]) : this {
        this.appendString(sprintf(template, ...args))
        return this;
    }

    append(value: string | CharSlice | Uint32Array) : this {
        
        if (value instanceof CharSlice) {
            this.appendSlice(value);
        } else if (value instanceof Uint32Array) {
            this.appendCharArray(value);
        } else {
            this.appendString(value);
        }

        return this;
    }

    appendChar(value: number) : this {
        if (!Number.isInteger(value) === false || (value < 0 || value > 0x10FFFF))
            throw new ArgumentError({ name: "value", message: "Argument 'value' must be a valid Unicode character." });

        this.grow(this.#length + 1);
        this.#buffer[this.#length] = value;
        return this;
    }

    appendSlice(value: CharSlice) : this {
        this.grow(this.#length + value.length);
        const l = this.length;
        for(let i = 0; i < value.length; i++) {
            this.#buffer[l + i] = value.at(i);
        }

        this.#length += value.length;
        return this;
    }

    appendString(value: string) {
        
        this.appendCharArray(toCharArray(value));
    }

    appendCharArray(value: Uint32Array) {
        this.grow(this.#length + value.length);
        this.#buffer.set(value,  this.#length);
        this.#length += value.length;
    }

    /**
     * Appends a string followed by a line break to the string builder.
     * @param value The string to append.
     * @returns The updated string builder.
     */
    appendLine(value?: string | Uint32Array | CharSlice): this {
        if (value !== undefined && value.length > 0) {
            this.append(value);
        }

        if (WINDOWS) {
            this.appendChar(13);
        }
        this.appendChar(10);

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

    clear(): this {
        this.#length = 0;
        this.#buffer.fill(0);
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

    toArray(): Uint32Array {
        const buffer = new Uint32Array(this.#length);
        buffer.set(this.#buffer.slice(0, this.#length));
        return buffer;
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
        const newBuffer = new Uint32Array(capacity);
        newBuffer.set(this.#buffer);
        this.#buffer = newBuffer;
        return this;
    }
}