import { trim, trimEnd, trimStart } from "./utils.ts";
import {
    camelize,
    capitalize,
    classify,
    dasherize,
    demodulize,
    foreignKey,
    humanize,
    ordinalize,
    pluralize,
    singularize,
    tableize,
    titleize,
    underscore,
} from "./inflections.ts";

/**
 * Represents a string transformation utility.
 */
export class Transform {
    #value: string;

    /**
     * Creates a new instance of the `Transform` class.
     * @param value - The initial string value.
     */
    constructor(value: string) {
        this.#value = value;
    }

    /**
     * Replaces occurrences of a specified value in the string.
     * @param searchValue - The value to search for.
     * @param replaceValue - The replacement value.
     * @returns The updated `Transform` instance.
     */
    replace(searchValue: string | RegExp, replaceValue: string): this {
        this.#value = this.#value.replace(searchValue, replaceValue);
        return this;
    }

    /**
     * Replaces all occurrences of a specified value in the string.
     * @param searchValue - The value to search for.
     * @param replaceValue - The replacement value.
     * @returns The updated `Transform` instance.
     */
    replaceAll(searchValue: string | RegExp, replaceValue: string): this {
        this.#value = this.#value.replaceAll(searchValue, replaceValue);
        return this;
    }

    /**
     * Extracts a portion of the string.
     * @param start - The starting index.
     * @param end - The ending index.
     * @returns The updated `Transform` instance.
     */
    slice(start?: number, end?: number): this {
        this.#value = this.#value.slice(start, end);
        return this;
    }

    /**
     * Maps each character in the string using a provided callback function.
     * @param callbackfn - The callback function to apply to each character.
     * @param thisArg - An optional object to use as `this` when executing the callback.
     * @returns The updated `Transform` instance.
     */
    // deno-lint-ignore no-explicit-any
    map(callbackfn: (value: string, index: number, array: string[]) => string, thisArg?: any): this {
        this.#value = Array.prototype.map.call(this.#value, callbackfn, thisArg).join("");
        return this;
    }

    /**
     * Retrieves a substring from the string.
     * @param start - The starting index.
     * @param end - The ending index.
     * @returns The updated `Transform` instance.
     */
    substring(start: number, end?: number): this {
        this.#value = this.#value.substring(start, end);
        return this;
    }

    /**
     * Converts the string to lowercase.
     * @returns The updated `Transform` instance.
     */
    toLowerCase(): this {
        this.#value = this.#value.toLowerCase();
        return this;
    }

    /**
     * Converts the string to uppercase.
     * @returns The updated `Transform` instance.
     */
    toUpperCase(): this {
        this.#value = this.#value.toUpperCase();
        return this;
    }

    /**
     * Converts the string to lowercase based on the host's current locale.
     * @returns The updated `Transform` instance.
     */
    toLocaleLowerCase(): this {
        this.#value = this.#value.toLocaleLowerCase();
        return this;
    }

    /**
     * Converts the string to uppercase based on the host's current locale.
     * @returns The updated `Transform` instance.
     */
    toLocaleUpperCase(): this {
        this.#value = this.#value.toLocaleUpperCase();
        return this;
    }

    /**
     * Pads the string with a specified character(s) at the start.
     * @param targetLength - The target length of the padded string.
     * @param padString - The string to use for padding.
     * @returns The updated `Transform` instance.
     */
    padStart(targetLength: number, padString?: string): this {
        this.#value = this.#value.padStart(targetLength, padString);
        return this;
    }

    /**
     * Pads the string with a specified character(s) at the end.
     * @param targetLength - The target length of the padded string.
     * @param padString - The string to use for padding.
     * @returns The updated `Transform` instance.
     */
    padEnd(targetLength: number, padString?: string): this {
        this.#value = this.#value.padEnd(targetLength, padString);
        return this;
    }

    /**
     * Removes leading and trailing whitespace or specified characters from the string.
     * @param chars - The characters to trim.
     * @returns The updated `Transform` instance.
     */
    trim(chars?: string): this {
        this.#value = trim(this.#value, chars);
        return this;
    }

    /**
     * Removes leading whitespace or specified characters from the string.
     * @param chars - The characters to trim.
     * @returns The updated `Transform` instance.
     */
    trimStart(chars?: string): this {
        this.#value = trimStart(this.#value, chars);
        return this;
    }

    /**
     * Removes trailing whitespace or specified characters from the string.
     * @param chars - The characters to trim.
     * @returns The updated `Transform` instance.
     */
    trimEnd(chars?: string): this {
        this.#value = trimEnd(this.#value, chars);
        return this;
    }

    /**
     * Capitalizes the first character of the string.
     * @returns The updated `Transform` instance.
     */
    capitalize(): this {
        this.#value = capitalize(this.#value);
        return this;
    }

    /**
     * Converts the string to kebab case.
     * @returns The updated `Transform` instance.
     */
    dasherize(): this {
        this.#value = dasherize(this.#value);
        return this;
    }

    /**
     * Converts the string to camel case.
     * @returns The updated `Transform` instance.
     */
    camelize(): this {
        this.#value = camelize(this.#value);
        return this;
    }

    /**
     * Converts a number to its ordinal form.
     * @returns The updated `Transform` instance.
     */
    ordinalize(): this {
        this.#value = ordinalize(this.#value);
        return this;
    }

    /**
     * Converts the string to a class name.
     * @returns The updated `Transform` instance.
     */
    classify(): this {
        this.#value = classify(this.#value);
        return this;
    }

    /**
     * Removes the module namespace from a string.
     * @returns The updated `Transform` instance.
     */
    demodulize(): this {
        this.#value = demodulize(this.#value);
        return this;
    }

    /**
     * Converts the string to a foreign key format.
     * @returns The updated `Transform` instance.
     */
    foreignKey(): this {
        this.#value = foreignKey(this.#value);
        return this;
    }

    /**
     * Converts the string to a human-readable format.
     * @returns The updated `Transform` instance.
     */
    humanize(): this {
        this.#value = humanize(this.#value);
        return this;
    }

    /**
     * Converts the string to its plural form.
     * @returns The updated `Transform` instance.
     */
    pluralize(): this {
        this.#value = pluralize(this.#value);
        return this;
    }

    /**
     * Converts the string to its singular form.
     * @returns The updated `Transform` instance.
     */
    singularize(): this {
        this.#value = singularize(this.#value);
        return this;
    }

    /**
     * Converts the string to a table name.
     * @returns The updated `Transform` instance.
     */
    tableize(): this {
        this.#value = tableize(this.#value);
        return this;
    }

    /**
     * Converts the string to title case.
     * @returns The updated `Transform` instance.
     */
    titleize(): Transform {
        this.#value = titleize(this.#value);
        return this;
    }

    /**
     * Converts the string to snake case.
     * @returns The updated `Transform` instance.
     */
    underscore(): Transform {
        this.#value = underscore(this.#value);
        return this;
    }

    /**
     * Returns the transformed string value.
     * @returns The transformed string value.
     */
    toString(): string {
        return this.#value;
    }
}

/**
 * Creates a new `Transform` instance with the specified string value.
 * @param value - The initial string value.
 * @returns A new `Transform` instance.
 */
export function transform(value: string): Transform {
    return new Transform(value);
}
