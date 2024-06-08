import type { Env, EnvPath, SubstitutionOptions } from "../types.d.ts";
import { expand } from "../expand.ts";

const envData: Record<string, undefined | string> = {};

/**
 * Represents a class that manages the environment path.
 */
class MemoryEnvPath implements EnvPath {
    /**
     * Retrieves the current environment path.
     * @returns The current environment path.
     */
    get(): string {
        return envData["PATH"] ?? "";
    }

    /**
     * Overwrites the environment path with the specified path.
     * @param path - The new environment path.
     */
    overwrite(path: string): void {
        envData["PATH"] = path;
    }

    /**
     * Splits the environment path into an array of individual paths.
     * @returns An array of individual paths.
     */
    split(): string[] {
        return this.get().split(":");
    }

    /**
     * Checks if the environment path contains the specified path.
     * @param path - The path to check.
     * @returns `true` if the path is found, `false` otherwise.
     */
    has(path: string): boolean {
        return this.split().includes(path);
    }

    /**
     * Appends the specified path to the environment path.
     * @param path - The path to append.
     */
    append(path: string): void {
        const paths = this.split();
        if (!paths.includes(path)) {
            paths.push(path);
            this.overwrite(this.join(paths));
        }
    }

    /**
     * Prepends the specified path to the environment path.
     * @param path - The path to prepend.
     */
    prepend(path: string): void {
        const paths = this.split();
        if (!paths.includes(path)) {
            paths.unshift(path);
            this.overwrite(this.join(paths));
        }
    }

    /**
     * Removes the specified path from the environment path.
     * @param path - The path to remove.
     */
    remove(path: string): void {
        const paths = this.split();
        const index = paths.indexOf(path);
        if (index !== -1) {
            paths.splice(index, 1);
            this.overwrite(this.join(paths));
        }
    }

    /**
     * Replaces the specified old path with the new path in the environment path.
     * @param oldPath - The path to replace.
     * @param newPath - The new path.
     */
    replace(oldPath: string, newPath: string): void {
        const paths = this.split();
        const index = paths.indexOf(oldPath);
        if (index !== -1) {
            paths[index] = newPath;
            this.overwrite(this.join(paths));
        }
    }

    /**
     * Returns an iterator for iterating over the individual paths in the environment path.
     * @returns An iterator for the individual paths.
     */
    *[Symbol.iterator](): IterableIterator<string> {
        for (const path of this.split()) {
            yield path;
        }
    }

    /**
     * Returns the string representation of the environment path.
     * @returns The string representation of the environment path.
     */
    toString(): string {
        return this.get();
    }

    private join(paths: string[]): string {
        return paths.join(":");
    }
}

/**
 * Represents the environment variables and provides methods to interact with them.
 */
class MemoryEnv implements Env {
    #path?: MemoryEnvPath;

    /**
     * Returns a proxy object that allows you to access, set, or delete
     * environment variables as properties.
     */
    get proxy(): Record<string, string | undefined> {
        return envData;
    }

    /**
     * Returns the `EnvPath` instance associated with this `Env` object.
     */
    get path(): MemoryEnvPath {
        return this.#path ??= new MemoryEnvPath();
    }

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
    expand(template: string, options?: SubstitutionOptions): string {
        return expand(
            template,
            (name: string) => this.get(name),
            (name: string, value: string) => this.set(name, value),
            options,
        );
    }

    /**
     * Retrieves the value of the specified environment variable.
     *
     * @param name - The name of the environment variable.
     * @returns The value of the environment variable, or `undefined` if it is not set.
     */
    get(name: string): string | undefined {
        return envData[name];
    }

    /**
     * Retrieves the value of the specified environment variable.
     * If the environment variable is not set, throws an error.
     *
     * @param name - The name of the environment variable.
     * @returns The value of the environment variable.
     * @throws {Error} If the environment variable is not set.
     */
    require(name: string): string {
        const value = this.get(name);
        if (value === undefined) {
            throw new Error(`Environment variable ${name} is not set`);
        }
        return value;
    }

    /**
     * Sets the value of the specified environment variable.
     *
     * @param name - The name of the environment variable.
     * @param value - The value to set.
     * @returns The updated instance of the `EnvBrowser` class.
     */
    set(name: string, value: string): this {
        envData[name] = value;
        return this;
    }

    /**
     * Merges the provided environment variables into the current environment.
     * @param env - The environment variables to merge.
     * @returns The updated instance of the `EnvBrowser` class.
     */
    merge(env: Record<string, string | undefined>): this {
        for (const key of Object.keys(env)) {
            const value = env[key];
            if (value === undefined) {
                delete envData[key];
            } else {
                envData[key] = value;
            }
        }

        return this;
    }

    /**
     * Checks if the specified environment variable is set.
     *
     * @param name - The name of the environment variable.
     * @returns `true` if the environment variable is set, `false` otherwise.
     */
    has(name: string): boolean {
        return envData[name] !== undefined;
    }

    *[Symbol.iterator](): IterableIterator<{ key: string; value: string }> {
        for (const key of Object.keys(envData)) {
            const value = envData[key];
            if (value === undefined) {
                continue;
            }

            yield { key, value: value };
        }
    }

    /**
     * Removes the specified environment variable.
     *
     * @param name - The name of the environment variable to remove.
     */
    remove(name: string): this {
        delete envData[name];
        return this;
    }

    /**
     * Returns the environment variables as a record of key-value pairs.
     *
     * @returns The environment variables as a record of key-value pairs.
     */
    toObject(): Record<string, string | undefined> {
        return Object.assign({}, envData);
    }

    /**
     * Prints the environment variables to the console.
     */
    dump(): void {
        const values = this.toObject();
        for (const key of Object.keys(values)) {
            console.log(`${key}=${values[key]}`);
        }
    }

    /**
     * Joins an array of paths into a single path string.
     *
     * @param paths - An array of paths to be joined.
     * @returns The joined path string.
     */
    joinPath(paths: string[]): string {
        return paths.join(":");
    }
}

export const env: Env = new MemoryEnv();
