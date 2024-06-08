import process from "node:process";
import type { Env, EnvPath, SubstitutionOptions } from "../types.d.ts";
import { expand } from "../expand.ts";
// deno-lint-ignore no-explicit-any
const g = globalThis as any;
const proc = g.process;

const WIN = process.platform === "win32";
const SEP = WIN ? ";" : ":";
const PATH_VAR = WIN ? "Path" : "PATH";

if (!proc) {
    throw new Error("The process global variable is not available.");
}

/**
 * Represents a class that manages the environment path.
 */
class NodeEnvPath implements EnvPath {
    /**
     * Retrieves the current environment path.
     * @returns The current environment path.
     */
    get(): string {
        return proc.env[PATH_VAR] ?? "";
    }

    /**
     * Overwrites the environment path with the specified path.
     * @param path - The new environment path.
     */
    overwrite(path: string): void {
        proc.env[PATH_VAR] = path;
    }

    /**
     * Splits the environment path into an array of individual paths.
     * @returns An array of individual paths.
     */
    split(): string[] {
        return this.get().split(SEP);
    }

    /**
     * Checks if the environment path contains the specified path.
     * @param path - The path to check.
     * @returns `true` if the path is found, `false` otherwise.
     */
    has(path: string): boolean {
        if (WIN) {
            for (const p of this.split()) {
                if (path.localeCompare(p, undefined, { sensitivity: "accent" }) === 0) {
                    return true;
                }
            }

            return false;
        }

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
        return paths.join(SEP);
    }
}

/**
 * Represents the environment variables and provides methods to interact with them.
 */
class NodeEnv implements Env {
    #path?: NodeEnvPath;

    /**
     * Returns a proxy object that allows you to access, set, or delete
     * environment variables as properties.
     */
    get proxy(): Record<string, string | undefined> {
        return proc.env;
    }

    /**
     * Returns the `EnvPath` instance associated with this `Env` object.
     */
    get path(): NodeEnvPath {
        return this.#path ??= new NodeEnvPath();
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
        return proc.env[name];
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
        proc.env[name] = value;
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
                this.remove(key);
            } else {
                this.set(key, value);
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
        const value = proc.env[name];
        console.log("has", name, value, typeof value, value !== undefined && value !== null);
        return value !== undefined && value !== null;
    }

    *[Symbol.iterator](): IterableIterator<{ key: string; value: string }> {
        const values = this.toObject();
        for (const key of Object.keys(values)) {
            const value = values[key];
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
     * @returns The updated instance of the `EnvBrowser` class.
     */
    remove(name: string): this {
        const ret = delete proc.env[name];
        console.log("delete", name, ret);
        return this;
    }

    /**
     * Returns the environment variables as a record of key-value pairs.
     *
     * @returns The environment variables as a record of key-value pairs.
     */
    toObject(): Record<string, string | undefined> {
        return Object.assign({}, proc.env);
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
        return paths.join(SEP);
    }
}

export const env: Env = new NodeEnv();
