export interface SubstitutionOptions {
    /**
     * Enables or disables Windows-style variable expansion.
     * @default true
     */
    windowsExpansion?: boolean;
    /**
     * Enables or disables Unix-style variable expansion.
     * @default true
     */
    unixExpansion?: boolean;
    /**
     * Enables or disables Unix-style variable assignment.
     * @default true
     */
    unixAssignment?: boolean;
    /**
     * Enables or disables Unix-style custom error messages.
     * @default true
     */
    unixCustomErrorMessage?: boolean;
    /**
     * Enables or disables Unix-style argument expansion.
     * @default true
     */
    unixArgsExpansion?: boolean;
    /**
     * A function that retrieves the value of an environment variable.
     * Setting this option overrides the default behavior
     * @param key - The name of the environment variable.
     * @returns The value of the environment variable, or `undefined` if it is not set.
     */
    getVariable?: (key: string) => string | undefined;
    /**
     * A function that sets the value of an environment variable.
     * Setting this option overrides the default behavior.
     * @param key - The name of the environment variable.
     * @param value - The value to set.
     */
    setVariable?: (key: string, value: string) => void;
}

export interface EnvPath extends Iterable<string> {
    /**
     * Retrieves the current environment path.
     * @returns The current environment path.
     */
    get(): string;

    /**
     * Overwrites the environment path with the specified path.
     * @param path - The new environment path.
     */
    overwrite(path: string): void;

    /**
     * Splits the environment path into an array of individual paths.
     * @returns An array of individual paths.
     */
    split(): string[];

    /**
     * Checks if the environment path contains the specified path.
     * @param path - The path to check.
     * @returns `true` if the path is found, `false` otherwise.
     */
    has(path: string): boolean;

    /**
     * Appends the specified path to the environment path.
     * @param path - The path to append.
     */
    append(path: string): void;

    /**
     * Prepends the specified path to the environment path.
     * @param path - The path to prepend.
     */
    prepend(path: string): void;

    /**
     * Removes the specified path from the environment path.
     * @param path - The path to remove.
     */
    remove(path: string): void;

    /**
     * Replaces the specified old path with the new path in the environment path.
     * @param oldPath - The path to replace.
     * @param newPath - The new path.
     */
    replace(oldPath: string, newPath: string): void;

    [Symbol.iterator](): IterableIterator<string>;

    /**
     * Returns the string representation of the environment path.
     * @returns The string representation of the environment path.
     */
    toString(): string;
}

export interface Env extends Iterable<{ key: string; value: string }> {
    /**
     * Returns the environment variables as a record of key-value pairs.
     */
    get proxy(): Record<string, string | undefined>;

    /**
     * Returns the `EnvPath` instance associated with this `Env` object.
     */
    get path(): EnvPath;

    /**
     * Expands a template string by replacing placeholders with their corresponding values.
     *
     * @param template The template string to expand.
     * @param options The options for substitution.
     * @returns The expanded string.
     * @example
     * ```ts
     * import { env } from "@gnome/env";
     *
     * env.set("NAME", "Alice");
     * console.log(env.expand("Hello, ${NAME}! You are ${AGE:-30} years old.")); // Hello, Alice! You are 30 years old.
     * ```
     */
    expand(template: string, options?: SubstitutionOptions): string;

    /**
     * Retrieves the value of the specified environment variable.
     *
     * @param name - The name of the environment variable.
     * @returns The value of the environment variable, or `undefined` if it is not set.
     */
    get(name: string): string | undefined;

    /**
     * Retrieves the value of the specified environment variable.
     * If the environment variable is not set, throws an error.
     *
     * @param name - The name of the environment variable.
     * @returns The value of the environment variable.
     * @throws {Error} If the environment variable is not set.
     */
    require(name: string): string;

    /**
     * Merges the provided environment variables into the current environment.
     * @param env - The environment variables to merge.
     * @returns The updated instance of the `EnvBrowser` class.
     */
    merge(env: Record<string, string | undefined>): this;

    /**
     * Sets the value of the specified environment variable.
     *
     * @param name - The name of the environment variable.
     * @param value - The value to set.
     */
    set(name: string, value: string): this;

    /**
     * Checks if the specified environment variable is set.
     *
     * @param name - The name of the environment variable.
     * @returns `true` if the environment variable is set, `false` otherwise.
     */
    has(name: string): boolean;

    /**
     * Removes the specified environment variable.
     *
     * @param name - The name of the environment variable to remove.
     */
    remove(name: string): this;

    /**
     * Prints the environment variables to the console.
     */
    dump(): void;

    /**
     * Returns the environment variables as a record of key-value pairs.
     *
     * @returns The environment variables as a record of key-value pairs.
     */
    toObject(): Record<string, string | undefined>;

    /**
     * Joins an array of paths into a single path string.
     *
     * @param paths - An array of paths to be joined.
     * @returns The joined path string.
     */
    joinPath(paths: string[]): string;
}
