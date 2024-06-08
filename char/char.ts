import { InvalidOperationError } from "@gnome/errors";

/**
 * Represents a unicode character (code point).
 */
export class Char {
    public value: number;

    /**
     * Creates a new instance of `Char` class.
     * @param value The value of the character.
     */
    constructor(value: number) {
        if (!Number.isInteger(value)) {
            throw new InvalidOperationError(
                "Invalid character value, value must be an integer",
            );
        }
        this.value = value;
    }

    // deno-lint-ignore no-inferrable-types
    /**
     * The maximum value of a character.
     */
    static MaxValue: number = 0xffff;

    // deno-lint-ignore no-inferrable-types
    /**
     * The minimum value of a character.
     */
    static MinValue: number = 0;

    [Symbol.toPrimitive](hint: string): string | number | boolean | bigint | null {
        switch (hint) {
            case "string":
                return String.fromCharCode(this.value);
            case "number":
                return this.value;

            case "boolean":
                return this.value > Char.MinValue && this.value < Char.MaxValue;

            case "bigint":
                return BigInt(this.value);

            default:
                return null;
        }
    }

    /**
     * Returns the string representation of the character.
     */
    public valueOf(): number {
        return this.value;
    }

    /**
     * Converts the character to its string representation.
     * @returns The string representation of the character.
     */
    public toString(): string {
        return String.fromCharCode(this.value);
    }
}
