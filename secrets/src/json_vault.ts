import { normalizeKey, type SecretRecord, type Vault } from "./vault.ts";
import { decodeBase64, encodeBase64 } from "@std/encoding";

// deno-lint-ignore no-explicit-any
const g = globalThis as any;
const { Deno, process, localStorage } = g;

let saveFile = (file: string, data: Uint8Array): Promise<void> => {
    if (localStorage) {
        localStorage.setItem(file, encodeBase64(data));
        return Promise.resolve();
    }

    g.tmpStorage ??= {};
    g.tmpStorage[file] = encodeBase64(data);
    return Promise.resolve();
};

let fileExists = (file: string): Promise<boolean> => {
    if (localStorage) {
        return Promise.resolve(localStorage.getItem(file) !== null);
    }

    return Promise.resolve(g.tmpStorage[file] !== undefined);
};

let loadFile = (file: string): Promise<Uint8Array> => {
    if (localStorage) {
        const data = localStorage.getItem(file);
        if (data === null) {
            return Promise.resolve(new Uint8Array());
        }

        return Promise.resolve(decodeBase64(data));
    }

    g.tmpStorage ??= {};
    const data = g.tmpStorage[file];
    if (data === undefined) {
        return Promise.resolve(new Uint8Array());
    }

    return Promise.resolve(decodeBase64(data));
};

if (Deno !== undefined || process !== undefined) {
    const { isFile, writeFile, readFile } = await import("@gnome/fs");

    saveFile = async (file: string, data: Uint8Array) => {
        await writeFile(file, data);
    };

    fileExists = async (file: string): Promise<boolean> => {
        return await isFile(file);
    };

    loadFile = async (file: string): Promise<Uint8Array> => {
        return await readFile(file);
    };
}

/**
 * Represents a JSON vault that stores secrets.
 */
export class JsonVault implements Vault {
    #secrets: Record<string, SecretRecord>;
    #key: CryptoKey;
    #file: string;
    #saveChain: Promise<void>;
    #loaded: boolean;
    #loadChain: Promise<void>;

    /**
     * Creates a new instance of the JsonVault class.
     * @param key The cryptographic key used for encryption and decryption.
     * @param file The file path where the vault data is stored.
     */
    constructor(key: CryptoKey, file: string) {
        this.#secrets = {};
        this.#key = key;
        this.#file = file;
        this.#saveChain = Promise.resolve();
        this.#loaded = false;
        this.#loadChain = Promise.resolve();
    }

    /**
     * Gets the name of the vault.
     */
    get name(): string {
        return "JSON Vault";
    }

    /**
     * Creates a new secret in the vault.
     * @param name The name of the secret.
     * @param value The value of the secret.
     * @param tags The tags associated with the secret.
     * @returns A promise that resolves to the created secret record.
     */
    async createSecret(name: string, value?: string, tags?: Record<string, string>): Promise<SecretRecord> {
        name = normalizeKey(name);
        const record: SecretRecord = {
            name,
            value,
            tags,
            createdAt: new Date(),
        };

        if (record.value !== undefined && record.value.length > 0) {
            record.value = await this.encryptValue(record.value);
        }

        this.#secrets[name] = record;

        await this.#saveChain.then(() => this.save());

        return record;
    }

    /**
     * Retrieves a secret from the vault by name.
     * @param name The name of the secret.
     * @returns A promise that resolves to the secret record, or undefined if the secret is not found.
     */
    async getSecret(name: string): Promise<SecretRecord | undefined> {
        await this.#loadChain;
        if (!this.#loaded) {
            await this.#loadChain.then(() => this.load()).then(() => this.#loaded = true);
        }

        name = normalizeKey(name);
        const model = this.#secrets[name];
        if (model === undefined) {
            return undefined;
        }

        const record = { ...model };

        if (record.value !== undefined && record.value.length > 0) {
            record.value = await this.decryptValue(record.value);
        }

        return record;
    }

    /**
     * Retrieves the value of a secret from the vault by name.
     * @param name The name of the secret.
     * @returns A promise that resolves to the value of the secret, or undefined if the secret is not found.
     */
    async getSecretValue(name: string): Promise<string | undefined> {
        if (!this.#loaded) {
            await this.#loadChain.then(() => this.load()).then(() => this.#loaded = true);
        }
        name = normalizeKey(name);
        const record = this.#secrets[name];

        if (record === undefined) {
            return undefined;
        }

        let value = record.value;
        if (value !== undefined && value.length > 0) {
            value = await this.decryptValue(value);
        }

        return value;
    }

    /**
     * Sets the value of a secret in the vault.
     * @param record The secret record containing the updated values.
     * @returns A promise that resolves when the secret is set.
     */
    async setSecret(record: SecretRecord): Promise<void> {
        if (!this.#loaded) {
            await this.#loadChain.then(() => this.load()).then(() => this.#loaded = true);
        }

        const name = normalizeKey(record.name);
        let model = this.#secrets[name];
        if (model === undefined) {
            model = await this.createSecret(name, record.value, record.tags);
        }

        model.value = record.value;
        model.expiresAt = record.expiresAt;
        model.tags = record.tags;

        if (model.value !== undefined && model.value.length > 0) {
            model.value = await this.encryptValue(model.value);
        }

        await this.#saveChain.then(() => this.save());
    }

    /**
     * Sets the value of a secret in the vault by name.
     * @param name The name of the secret.
     * @param value The new value of the secret.
     * @returns A promise that resolves when the secret value is set.
     */
    async setSecretValue(name: string, value: string): Promise<void> {
        if (!this.#loaded) {
            await this.#loadChain.then(() => this.load()).then(() => this.#loaded = true);
        }

        name = normalizeKey(name);
        const record = this.#secrets[name];
        if (record === undefined) {
            throw new Error(`Secret ${name} not found`);
        }

        record.value = value;

        if (record.value !== undefined && record.value.length > 0) {
            record.value = await this.encryptValue(record.value);
        }

        return this.#saveChain.then(() => this.save());
    }

    /**
     * Deletes a secret from the vault by name.
     * @param name The name of the secret to delete.
     * @returns A promise that resolves when the secret is deleted.
     */
    async deleteSecretByName(name: string): Promise<void> {
        if (!this.#loaded) {
            await this.#loadChain.then(() => this.load()).then(() => this.#loaded = true);
        }
        name = normalizeKey(name);
        delete this.#secrets[name];

        return this.#saveChain.then(() => this.save());
    }

    /**
     * Deletes a secret from the vault.
     * @param record The secret record to delete.
     * @returns A promise that resolves when the secret is deleted.
     */
    deleteSecret(record: SecretRecord): Promise<void> {
        const name = normalizeKey(record.name);
        return this.deleteSecretByName(name);
    }

    /**
     * Lists all secrets in the vault.
     * @returns A promise that resolves to an array of secret records.
     */
    async listSecrets(): Promise<SecretRecord[]> {
        if (!this.#loaded) {
            await this.#loadChain.then(() => this.load()).then(() => this.#loaded = true);
        }

        const records: SecretRecord[] = [];
        for (const key in this.#secrets) {
            const model = this.#secrets[key];
            const record = { ...model };
            if (record.value !== undefined && record.value.length > 0) {
                record.value = await this.decryptValue(record.value);
            }

            records.push(record);
        }

        return records;
    }

    /**
     * Lists the names of all secrets in the vault.
     * @returns A promise that resolves to an array of secret names.
     */
    async listSecretNames(): Promise<string[]> {
        if (!this.#loaded) {
            await this.#loadChain.then(() => this.load()).then(() => this.#loaded = true);
        }

        return Object.keys(this.#secrets);
    }

    /**
     * Saves the vault data to the file.
     * @returns A promise that resolves when the data is saved.
     */
    async save(): Promise<void> {
        const data = {
            secrets: this.#secrets,
        };

        const encoder = new TextEncoder();
        const encoded = encoder.encode(JSON.stringify(data, null, 2));

        await saveFile(this.#file, encoded);
    }

    /**
     * Loads the vault data from the file.
     * @returns A promise that resolves when the data is loaded.
     */
    async load(): Promise<void> {
        if (!await fileExists(this.#file)) {
            this.#loaded = true;
            return;
        }

        const data = await loadFile(this.#file);
        const decoder = new TextDecoder();
        const decoded = decoder.decode(data);

        const json = JSON.parse(decoded);
        this.#secrets = json.secrets;
        this.#loaded = true;
    }

    private async encryptValue(value: string): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(value);

        const iv = crypto.getRandomValues(new Uint8Array(12));

        const encrypted = await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv,
            },
            this.#key,
            data,
        );

        const buffer = new Uint8Array(encrypted.byteLength + 12);
        buffer.set(new Uint8Array(iv), 0);
        buffer.set(new Uint8Array(encrypted), 12);
        return encodeBase64(buffer);
    }

    private async decryptValue(value: string): Promise<string> {
        const data = decodeBase64(value);
        const iv = data.slice(0, 12);
        const encrypted = data.slice(12);

        const decrypted = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv,
            },
            this.#key,
            encrypted,
        );

        const decoder = new TextDecoder();
        return decoder.decode(decrypted);
    }
}
