export interface SecretMasker {
    add(value: string): SecretMasker;
    addGenerator(generator: (secret: string) => string): SecretMasker;
    mask(value: string | null): string | null;
}

export class DefaultSecretMasker {
    #secrets: string[];
    #generators: Array<(secret: string) => string>;

    constructor() {
        this.#secrets = [];
        this.#generators = [];
    }

    add(value: string): SecretMasker {
        if (!this.#secrets.includes(value)) {
            this.#secrets.push(value);
        }

        this.#generators.forEach((generator) => {
            const next = generator(value);
            if (!this.#secrets.includes(next)) {
                this.#secrets.push(next);
            }
        });

        return this;
    }

    addGenerator(generator: (secret: string) => string): SecretMasker {
        this.#generators.push(generator);

        return this;
    }

    mask(value: string | null): string | null {
        if (value === null) {
            return value;
        }

        let str: string = value;
        this.#secrets.forEach((next) => {
            const regex = new RegExp(`${next}`, "gi");

            str = str.replace(regex, "*******");
        });

        return str;
    }
}

export const secretMasker: SecretMasker = new DefaultSecretMasker();
