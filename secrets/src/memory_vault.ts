import { normalizeKey, type SecretRecord, type Vault } from "./vault.ts";

/**
 * Represents a memory vault that stores secrets in memory.
 */
export class MemoryVault implements Vault {
    #secrets: Record<string, SecretRecord>;

    /**
     * Creates a new instance of the MemoryVault class.
     */
    constructor() {
        this.#secrets = {};
    }

    /**
     * Gets the name of the vault.
     * @returns The name of the vault.
     */
    get name(): string {
        return "Memory Vault";
    }

    /**
     * Creates a new secret in the vault.
     * @param name - The name of the secret.
     * @param value - The value of the secret.
     * @param tags - The tags associated with the secret.
     * @returns A promise that resolves to the created secret record.
     */
    createSecret(name: string, value?: string, tags?: Record<string, string>): Promise<SecretRecord> {
        name = normalizeKey(name);
        const model: SecretRecord = {
            name,
            value,
            tags,
            createdAt: new Date(),
        };

        this.#secrets[name] = model;
        const record = { ...model };
        return Promise.resolve(record);
    }

    /**
     * Gets a secret from the vault by its name.
     * @param name - The name of the secret.
     * @returns A promise that resolves to the secret record, or undefined if the secret is not found.
     */
    getSecret(name: string): Promise<SecretRecord | undefined> {
        name = normalizeKey(name);
        const model = this.#secrets[name];
        if (model === undefined) {
            return Promise.resolve(undefined);
        }

        return Promise.resolve({ ...model });
    }

    /**
     * Gets the value of a secret from the vault by its name.
     * @param name - The name of the secret.
     * @returns A promise that resolves to the value of the secret, or undefined if the secret is not found.
     */
    async getSecretValue(name: string): Promise<string | undefined> {
        const record = await this.getSecret(name);
        if (record === undefined) {
            return undefined;
        }

        return record.value;
    }

    /**
     * Sets the value of a secret in the vault.
     * @param record - The secret record to set.
     * @returns A promise that resolves when the secret is set.
     */
    setSecret(record: SecretRecord): Promise<void> {
        const name = normalizeKey(record.name);
        let model = this.#secrets[name];
        if (model === undefined) {
            model = { ...record };
        } else {
            model.value = record.value;
            model.expiresAt = record.expiresAt;
            model.tags = record.tags;
        }

        this.#secrets[name] = model;
        return Promise.resolve();
    }

    /**
     * Sets the value of a secret in the vault by its name.
     * @param name - The name of the secret.
     * @param value - The new value of the secret.
     * @returns A promise that resolves when the secret value is set.
     * @throws Error if the secret is not found.
     */
    setSecretValue(name: string, value: string): Promise<void> {
        name = normalizeKey(name);
        let record = this.#secrets[name];
        if (record === undefined) {
            record = { name, value };
        }

        record.value = value;
        return Promise.resolve();
    }

    /**
     * Deletes a secret from the vault by its name.
     * @param name - The name of the secret.
     * @returns A promise that resolves when the secret is deleted.
     */
    deleteSecretByName(name: string): Promise<void> {
        delete this.#secrets[normalizeKey(name)];
        return Promise.resolve();
    }

    /**
     * Deletes a secret from the vault.
     * @param record - The secret record to delete.
     * @returns A promise that resolves when the secret is deleted.
     */
    async deleteSecret(record: SecretRecord): Promise<void> {
        await this.deleteSecretByName(record.name);
    }

    /**
     * Lists all secrets in the vault.
     * @returns A promise that resolves to an array of secret records.
     */
    listSecrets(): Promise<SecretRecord[]> {
        return Promise.resolve(Object.values(this.#secrets).map((record) => ({ ...record })));
    }

    /**
     * Lists the names of all secrets in the vault.
     * @returns A promise that resolves to an array of secret names.
     */
    listSecretNames(): Promise<string[]> {
        return Promise.resolve(Object.keys(this.#secrets));
    }
}
