import { StringBuilder } from "@gnome/strings";
import { isDigit, isLetter } from "@gnome/chars";
import { CHAR_BACKWARD_SLASH, CHAR_FORWARD_SLASH, CHAR_HYPHEN_MINUS, CHAR_SEMICOLON } from "@gnome/chars/constants";

const sb = new StringBuilder();

/**
 * Normalizes a key by replacing special characters with a delimiter or hyphen-minus.
 * @param key - The key to be normalized.
 * @param delimiter - The delimiter to be used for replacing special characters. Defaults to CHAR_FORWARD_SLASH.
 * @returns The normalized key.
 */
export function normalizeKey(key: string, delmiter?: number): string {
    delmiter = delmiter || CHAR_FORWARD_SLASH;
    for (let i = 0; i < key.length; i++) {
        const c = key.charCodeAt(i);
        if (c === CHAR_BACKWARD_SLASH || c === CHAR_SEMICOLON || c === CHAR_FORWARD_SLASH) {
            sb.appendChar(delmiter);
            continue;
        }

        if (!isLetter(c) && !isDigit(c)) {
            sb.appendChar(CHAR_HYPHEN_MINUS);
            continue;
        }

        sb.appendChar(c);
    }

    const result = sb.toString();
    sb.clear();
    return result;
}

/**
 * Represents a secret record.
 */
/**
 * Represents a secret record.
 */
export interface SecretRecord {
    /**
     * The name of the secret.
     */
    readonly name: string;

    /**
     * The value of the secret.
     */
    value?: string;

    /**
     * The expiration date of the secret.
     */
    expiresAt?: Date;

    /**
     * The creation date of the secret.
     */
    createdAt?: Date;

    /**
     * Additional tags associated with the secret.
     */
    tags?: Record<string, string>;

    /**
     * The version of the secret.
     */
    readonly version?: string;
}

/**
 * Represents a vault that stores secrets.
 */
export interface Vault {
    /**
     * The name of the vault.
     */
    readonly name: string;

    /**
     * Creates a new secret in the vault.
     * @param name - The name of the secret.
     * @param value - The value of the secret.
     * @param tags - Optional tags associated with the secret.
     * @returns A promise that resolves to the created secret record.
     */
    createSecret(name: string, value: string, tags?: Record<string, string>): Promise<SecretRecord>;

    /**
     * Retrieves a secret from the vault.
     * @param name - The name of the secret.
     * @returns A promise that resolves to the secret record, or undefined if the secret does not exist.
     */
    getSecret(name: string): Promise<SecretRecord | undefined>;

    /**
     * Retrieves the value of a secret from the vault.
     * @param name - The name of the secret.
     * @returns A promise that resolves to the value of the secret, or undefined if the secret does not exist.
     */
    getSecretValue(name: string): Promise<string | undefined>;

    /**
     * Sets the value of a secret in the vault.
     * @param record - The secret record to set.
     * @returns A promise that resolves when the secret is set.
     */
    setSecret(record: SecretRecord): Promise<void>;

    /**
     * Sets the value of a secret in the vault.
     * @param name - The name of the secret.
     * @param value - The value of the secret.
     * @returns A promise that resolves when the secret is set.
     */
    setSecretValue(name: string, value: string): Promise<void>;

    /**
     * Deletes a secret from the vault by its name.
     * @param name - The name of the secret to delete.
     * @returns A promise that resolves when the secret is deleted.
     */
    deleteSecretByName(name: string): Promise<void>;

    /**
     * Deletes a secret from the vault.
     * @param record - The secret record to delete.
     * @returns A promise that resolves when the secret is deleted.
     */
    deleteSecret(record: SecretRecord): Promise<void>;

    /**
     * Lists all secrets in the vault.
     * @returns A promise that resolves to an array of secret records.
     */
    listSecrets(): Promise<SecretRecord[]>;

    /**
     * Lists the names of all secrets in the vault.
     * @returns A promise that resolves to an array of secret names.
     */
    listSecretNames(): Promise<string[]>;
}
