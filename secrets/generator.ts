import { InvalidOperationError } from "@gnome/errors";
import { isDigit, isLetter, isUpper } from "@gnome/char";
import { randomBytes } from "@gnome/random";

export function validate(data: Uint8Array): boolean {
    let hasDigit = false;
    let hasUpper = false;
    let hasLower = false;
    let hasSpecial = false;

    for (let i = 0; i < data.length; i++) {
        const c = data[i];
        // throw?
        if (c === undefined) {
            continue;
        }

        if (isLetter(c)) {
            if (isUpper(c)) {
                hasUpper = true;
                continue;
            }

            hasLower = true;
            continue;
        }

        if (isDigit(c)) {
            hasDigit = true;
            continue;
        }

        hasSpecial = true;
    }

    return hasDigit && hasUpper && hasLower && hasSpecial;
}

export interface SecretGenerator {
    setValidator(validator: (value: Uint8Array) => boolean): void;
    add(value: string): SecretGenerator;
    generate(length: number): string;
    generateAsUint8Array(length: number): Uint8Array;
}

export class DefaultSecretGenerator {
    #codes: number[];
    #validator: (value: Uint8Array) => boolean;

    constructor() {
        this.#codes = [];
        this.#validator = validate;
    }

    setValidator(validator: (value: Uint8Array) => boolean): this {
        this.#validator = validator;
        return this;
    }

    addDefaults(): this {
        this.add(
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-#@~*:{}",
        );
        return this;
    }

    add(value: string): this {
        for (let i = 0; i < value.length; i++) {
            const c = value.codePointAt(i);
            if (c === undefined) {
                continue;
            }

            if (this.#codes.includes(c)) {
                continue;
            }

            this.#codes.push(c);
        }

        return this;
    }

    generateAsUint8Array(length: number): Uint8Array {
        // useful for generating as password that can be cleared from memory
        // as strings are immutable in javascript
        let valid = false;
        const chars: Uint8Array = new Uint8Array(length);
        const maxAttempts = 5000;
        let attempts = 0;

        while (!valid && attempts < maxAttempts) {
            chars.fill(0);
            const bytes = randomBytes(length);

            for (let i = 0; i < length; i++) {
                const bit = Math.abs(bytes[i]) % this.#codes.length;
                chars[i] = this.#codes[bit];
            }

            attempts++;
            valid = this.#validator(chars);
        }

        if (!valid) {
            throw new InvalidOperationError("Failed to generate secret");
        }

        return chars;
    }

    generate(length: number): string {
        const chars = this.generateAsUint8Array(length);
        return String.fromCodePoint(...chars);
    }
}

export function generateSecret(length: number, characters?: string): string {
    const generator = new DefaultSecretGenerator();
    if (characters) {
        generator.add(characters);
    } else {
        generator.addDefaults();
    }

    return generator.generate(length);
}

export const secretGenerator: DefaultSecretGenerator = new DefaultSecretGenerator().addDefaults();
