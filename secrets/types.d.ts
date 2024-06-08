export interface SecretRecord {
    readonly name: string;
    value?: string;
    expiresAt?: Date;
    createdAt?: Date;
    tags?: Record<string, string>;
    readonly version?: string;
}

export interface Vault {
    readonly name: string;

    createSecret(name: string, value: string, tags?: Record<string, string>): Promise<SecretRecord>;

    getSecret(name: string): Promise<SecretRecord | undefined>;

    getSecretValue(name: string): Promise<string | undefined>;

    setSecret(record: SecretRecord): Promise<void>;

    setSecretValue(name: string, value: string): Promise<void>;

    deleteSecretByName(name: string): Promise<void>;

    deleteSecret(record: SecretRecord): Promise<void>;

    listSecrets(): Promise<SecretRecord[]>;

    listSecretNames(): Promise<string[]>;
}
