import { join, normalize } from "@std/path";
import { createWalkEntry, createWalkEntrySync, toPathString } from "./utils.ts";
import type { WalkEntry } from "./types.ts";
import { lstat, lstatSync, readDir, readDirSync, realPath, realPathSync } from "./base.ts";

/** Error thrown in {@linkcode walk} or {@linkcode walkSync} during iteration. */
export class WalkError extends Error {
    /** File path of the root that's being walked. */
    root: string;

    /** Constructs a new instance. */
    constructor(cause: unknown, root: string) {
        super(
            `${cause instanceof Error ? cause.message : cause} for path "${root}"`,
        );
        this.cause = cause;
        this.name = this.constructor.name;
        this.root = root;
    }
}

function include(
    path: string,
    exts?: string[],
    match?: RegExp[],
    skip?: RegExp[],
): boolean {
    if (exts && !exts.some((ext): boolean => path.endsWith(ext))) {
        return false;
    }
    if (match && !match.some((pattern): boolean => !!path.match(pattern))) {
        return false;
    }
    if (skip && skip.some((pattern): boolean => !!path.match(pattern))) {
        return false;
    }
    return true;
}

function wrapErrorWithPath(err: unknown, root: string) {
    if (err instanceof WalkError) return err;
    return new WalkError(err, root);
}

/** Options for {@linkcode walk} and {@linkcode walkSync}. */
export interface WalkOptions {
    /**
     * The maximum depth of the file tree to be walked recursively.
     *
     * @default {Infinity}
     */
    maxDepth?: number;
    /**
     * Indicates whether file entries should be included or not.
     *
     * @default {true}
     */
    includeFiles?: boolean;
    /**
     * Indicates whether directory entries should be included or not.
     *
     * @default {true}
     */
    includeDirs?: boolean;
    /**
     * Indicates whether symlink entries should be included or not.
     * This option is meaningful only if `followSymlinks` is set to `false`.
     *
     * @default {true}
     */
    includeSymlinks?: boolean;
    /**
     * Indicates whether symlinks should be resolved or not.
     *
     * @default {false}
     */
    followSymlinks?: boolean;
    /**
     * Indicates whether the followed symlink's path should be canonicalized.
     * This option works only if `followSymlinks` is not `false`.
     *
     * @default {true}
     */
    canonicalize?: boolean;
    /**
     * List of file extensions used to filter entries.
     * If specified, entries without the file extension specified by this option
     * are excluded.
     *
     * @default {undefined}
     */
    exts?: string[];
    /**
     * List of regular expression patterns used to filter entries.
     * If specified, entries that do not match the patterns specified by this
     * option are excluded.
     *
     * @default {undefined}
     */
    match?: RegExp[];
    /**
     * List of regular expression patterns used to filter entries.
     * If specified, entries matching the patterns specified by this option are
     * excluded.
     *
     * @default {undefined}
     */
    skip?: RegExp[];
}
export type { WalkEntry };

/**
 * Recursively walks through a directory and yields information about each file
 * and directory encountered.
 *
 * @param root The root directory to start the walk from, as a string or URL.
 * @param options The options for the walk.
 * @returns An async iterable iterator that yields `WalkEntry` objects.
 *
 * @example Basic usage
 *
 * File structure:
 * ```
 * folder
 * ├── script.ts
 * └── foo.ts
 * ```
 *
 * ```ts
 * import { walk } from "@gnome/fs";
 *
 * const entries = [];
 * for await (const entry of walk(".")) {
 *   entries.push(entry);
 * }
 *
 * entries[0]!.path; // "folder"
 * entries[0]!.name; // "folder"
 * entries[0]!.isFile; // false
 * entries[0]!.isDirectory; // true
 * entries[0]!.isSymlink; // false
 *
 * entries[1]!.path; // "folder/script.ts"
 * entries[1]!.name; // "script.ts"
 * entries[1]!.isFile; // true
 * entries[1]!.isDirectory; // false
 * entries[1]!.isSymlink; // false
 * ```
 */
export async function* walk(
    root: string | URL,
    {
        maxDepth = Infinity,
        includeFiles = true,
        includeDirs = true,
        includeSymlinks = true,
        followSymlinks = false,
        canonicalize = true,
        exts = undefined,
        match = undefined,
        skip = undefined,
    }: WalkOptions = {},
): AsyncIterableIterator<WalkEntry> {
    if (maxDepth < 0) {
        return;
    }
    root = toPathString(root);
    if (includeDirs && include(root, exts, match, skip)) {
        yield await createWalkEntry(root);
    }
    if (maxDepth < 1 || !include(root, undefined, undefined, skip)) {
        return;
    }
    try {
        for await (const entry of readDir(root)) {
            let path = join(root, entry.name);

            let { isSymlink, isDirectory } = entry;

            if (isSymlink) {
                if (!followSymlinks) {
                    if (includeSymlinks && include(path, exts, match, skip)) {
                        yield { path, ...entry };
                    }
                    continue;
                }
                const rp = await realPath(path);
                if (canonicalize) {
                    path = rp;
                }
                // Caveat emptor: don't assume |path| is not a symlink. realpath()
                // resolves symlinks but another process can replace the file system
                // entity with a different type of entity before we call lstat().
                ({ isSymlink, isDirectory } = await lstat(rp));
            }

            if (isSymlink || isDirectory) {
                yield* walk(path, {
                    maxDepth: maxDepth - 1,
                    includeFiles,
                    includeDirs,
                    includeSymlinks,
                    followSymlinks,
                    exts,
                    match,
                    skip,
                });
            } else if (includeFiles && include(path, exts, match, skip)) {
                yield { path, ...entry };
            }
        }
    } catch (err) {
        throw wrapErrorWithPath(err, normalize(root));
    }
}

/** Same as {@linkcode walk} but uses synchronous ops */
export function* walkSync(
    root: string | URL,
    {
        maxDepth = Infinity,
        includeFiles = true,
        includeDirs = true,
        includeSymlinks = true,
        followSymlinks = false,
        canonicalize = true,
        exts = undefined,
        match = undefined,
        skip = undefined,
    }: WalkOptions = {},
): IterableIterator<WalkEntry> {
    root = toPathString(root);
    if (maxDepth < 0) {
        return;
    }
    if (includeDirs && include(root, exts, match, skip)) {
        yield createWalkEntrySync(root);
    }
    if (maxDepth < 1 || !include(root, undefined, undefined, skip)) {
        return;
    }
    let entries;
    try {
        entries = readDirSync(root);
    } catch (err) {
        throw wrapErrorWithPath(err, normalize(root));
    }
    for (const entry of entries) {
        let path = join(root, entry.name);

        let { isSymlink, isDirectory } = entry;

        if (isSymlink) {
            if (!followSymlinks) {
                console.log("not following symlink:", root);
                if (includeSymlinks && include(path, exts, match, skip)) {
                    yield { path, ...entry };
                }
                continue;
            }

            console.log("following symlink:", root);
            const realPath = realPathSync(path);
            if (canonicalize) {
                path = realPath;
            }
            // Caveat emptor: don't assume |path| is not a symlink. realpath()
            // resolves symlinks but another process can replace the file system
            // entity with a different type of entity before we call lstat().
            ({ isSymlink, isDirectory } = lstatSync(realPath));
        }

        if (isSymlink || isDirectory) {
            yield* walkSync(path, {
                maxDepth: maxDepth - 1,
                includeFiles,
                includeDirs,
                includeSymlinks,
                followSymlinks,
                exts,
                match,
                skip,
            });
        } else if (includeFiles && include(path, exts, match, skip)) {
            yield { path, ...entry };
        }
    }
}
