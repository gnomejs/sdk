import { dasherize, underscore } from "@gnome/strings/inflections";

const match = (array: unknown[], value: string) =>
    array.some((
        element,
    ) => (element instanceof RegExp ? element.test(value) : element === value));

/**
 * Options for the {@linkcode splat} function.
 */
export interface SplatOptions {
    /**
     * The command to execute.
     */
    command?: string[] | string;
    /**
     * The prefix to use for commandline options. Defaults to `"--"`.
     */
    prefix?: string;

    /**
     * Treats the flags as options that emit values.
     */
    noFlags?: string[] | boolean;

    /**
     * The values for true and false for flags.
     */
    noFlagValues?: { t?: string, f?: string }

    /**
     * A lookup of aliases to remap the keys of the object
     * to the actual commandline option.  e.g. `{ "yes": "-y" }`
     * will map `{ yes: true }` to `["-y"]`.
     */
    aliases?: Record<string, string>;
    /**
     * The assigment token to use with options that have a value. The default
     * is to use a space. The common overrides are `":"` and `"="`.
     * This will turn `{ foo: "bar" }` into `["--foo", "bar"]` by default. If
     * assigned to `"="` it will become `["--foo=bar"]`.
     */
    assign?: string;
    /**
     * Whether to preserve the case of the keys. Defaults to `false`.
     */
    preserveCase?: boolean;

    /**
     * Whether to use short flags. Defaults to `true`.
     */
    shortFlag?: boolean;
    /**
     * Only include the keys that are in the `includes` array. Includes
     * take precedence over excludes.
     */
    includes?: Array<string | RegExp>;
    /**
     * Exclude the keys that are in the `excludes` array.
     */
    excludes?: Array<string | RegExp>;
    /**
     * Whether to ignore flags with `true` values. Defaults to `false`.
     */
    ignoreTrue?: boolean;
    /**
     * Whether to ignore flags with `false` values. Defaults to `false`.
     */
    ignoreFalse?: boolean;
    /**
     * The names of positional arguments. This will gather any keys as arguments
     * in the order of the given array.
     *
     * @example
     * ```ts
     * const args = splat({ foo: "bar", baz: "qux" }, { arguments: ["foo", "baz"] });
     * console.log(args); // ["bar", "qux"]
     * ```
     */
    arguments?: string[];
    /**
     * Whether to append the arguments to the end of the command. Defaults to `false`.
     *
     * @example
     * ```ts
     * const args = splat({ first: 1, foo: "bar", baz: "qux" }, { arguments: ["foo", "baz"], appendArguments: true });
     * console.log(args); // ["--first", "1", "bar", "qux"]
     * ```
     */
    appendArguments?: boolean;
}

/**
 * An object that contains the options for the {@linkcode splat} function.
 *
 * @example
 * ```ts
 * const args = splat({ f: "bar", splat: { shortFlag: true } });
 * console.log(args); // ["-f", "bar"]
 * ```
 */
export interface SplatObject extends Record<string, unknown> {
    splat?: SplatOptions;
}

/**
 * Converts an object to an `string[]` of command line arguments.
 *
 * @description
 * This is a modified version of the dargs npm package.  Its useful for converting an object to an array of command line arguments
 * especially when using typescript interfaces to provide intellisense and type checking for command line arguments
 * for an executable or commands in an executable.
 *
 * The code https://github.com/sindresorhus/dargs which is under under MIT License.
 * The original code is Copyrighted under (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
 * @param object The object to convert
 * @param options The options to use
 * @returns An array of command line arguments
 * @example
 * ```ts
 * const args = splat({ foo: "bar" });
 * console.log(args); // ["--foo", "bar"]
 * ```
 */
export function splat(
    object: Record<string, unknown> | SplatObject,
    options?: SplatOptions,
): string[] {
    const splat = [];
    let extraArguments = [];
    let separatedArguments = [];

    if (object.splat) {
        options = {
            ...object.splat,
            ...options,
        };

        delete object.splat;
    }

    options = {
        shortFlag: true,
        prefix: "--",
        ...options,
    };

    const makeArguments = (key: string, value?: unknown) => {
        const prefix = options?.shortFlag && key.length === 1 ? "-" : options?.prefix;
        const theKey = options?.preserveCase ? key : dasherize(underscore(key));

        key = prefix + theKey;

        if (options?.assign) {
            splat.push(key + (value ? `${options.assign}${value}` : ""));
        } else {
            splat.push(key);
            if (value) {
                splat.push(value);
            }
        }
    };

    const makeAliasArg = (key: string, value?: unknown) => {
        splat.push(`-${key}`);

        if (value) {
            splat.push(value);
        }
    };

    let isNoFlag = (_key: string) : boolean => {
        return false;
    }

    if (options.noFlags !== undefined) {
        if (options.noFlagValues === undefined) {
            options.noFlagValues = {t: "true", f: "false"}
        }

        if (Array.isArray(options.noFlags))
            isNoFlag = (key) => (options.noFlags as string[]).includes(key);
        else 
            isNoFlag = (_key) => true;
    }

    let argz: unknown[] = [];
    if (object.arguments && Array.isArray(object.arguments)) {
        argz = object.arguments;
    } else if (options.arguments?.length) {
        argz.length = options.arguments.length;
    }

    for (let [key, value] of Object.entries(object)) {
        let pushArguments = makeArguments;

        if (options.arguments?.length && options.arguments.includes(key)) {
            // ensure the order of the arguments
            const index = options.arguments.indexOf(key);
            if (value) {
                argz[index] = value;
            }

            continue;
        }

        if (Array.isArray(options.excludes) && match(options.excludes, key)) {
            continue;
        }

        if (Array.isArray(options.includes) && !match(options.includes, key)) {
            continue;
        }

        if (typeof options.aliases === "object" && options.aliases[key]) {
            key = options.aliases[key];
            pushArguments = makeAliasArg;
        }

        if (key === "--") {
            if (!Array.isArray(value)) {
                throw new TypeError(
                    `Expected key \`--\` to be Array, got ${typeof value}`,
                );
            }

            separatedArguments = value;
            continue;
        }

        if (key === "_") {
            if (typeof value === "string") {
                extraArguments = [value];
                continue;
            }

            if (!Array.isArray(value)) {
                throw new TypeError(
                    `Expected key \`_\` to be Array, got ${typeof value}`,
                );
            }

            extraArguments = value;
            continue;
        }

        if (value === true && !options.ignoreTrue) {
            if (isNoFlag(key))
                pushArguments(key, options.noFlagValues?.t);
            else 
                pushArguments(key);
        }

        if (value === false && !options.ignoreFalse) {
            if (isNoFlag(key))
                pushArguments(key, options.noFlagValues?.f)
            else 
                pushArguments(`no-${key}`);
        }

        if (typeof value === "string") {
            pushArguments(key, value);
        }

        if (typeof value === "number" && !Number.isNaN(value)) {
            pushArguments(key, String(value));
        }

        if (Array.isArray(value)) {
            for (const arrayValue of value) {
                pushArguments(key, arrayValue);
            }
        }
    }

    for (const argument of extraArguments) {
        splat.unshift(String(argument));
    }

    if (separatedArguments.length > 0) {
        splat.push("--");
    }

    for (const argument of separatedArguments) {
        splat.push(String(argument));
    }

    if (argz.length) {
        const unwrapped: string[] = [];
        // ensure the order of the arguments
        for (const arg of argz) {
            if (arg) {
                if (Array.isArray(arg)) {
                    unwrapped.push(...arg.map((a) => String(a)));
                } else {
                    unwrapped.push(String(arg));
                }
            }
        }

        if (options.appendArguments) {
            splat.push(...unwrapped);
        } else {
            splat.unshift(...unwrapped);
        }
    }

    // add the command to the beginning of the parameters
    if (options?.command?.length) {
        if (typeof options.command === "string") {
            options.command = options.command.split(" ").filter((c) => c.trim().length > 0);
        }

        splat.unshift(...options.command);
    }

    return splat;
}
