import { env } from "@gnome/env";
import { basename, extname, isAbsolute, join, resolve } from "@std/path";
import { isDir, isDirSync, isFile, isFileSync, readDir, readDirSync } from "@gnome/fs";
import { WINDOWS } from "@gnome/os-constants";
import { isNullOrEmpty, isNullOrWhiteSpace } from "@gnome/strings";
import { ArgumentWhiteSpaceError } from "@gnome/errors";

const executableCache: { [key: string]: string | undefined } = {};

/**
 * which - Returns the full path of the executable file of the given program;
 * otherwise, returns undefined.
 *
 * @remarks The returned path is the full path of the executable file of the given program
 * if the program can be found in the system PATH environment variable or
 * using any of the paths from `prependedPaths` if specified.
 *
 * By default, `which` will cache the first lookup and then use the cache
 * for subsequent lookups unless `useCache` is set to false.
 *
 * @param {string} fileName The program file name.
 * @param {(string[] | undefined)} prependPath The paths to prepend to the PATH environment variable.
 * @param {IEnvironment} env The environment class to use to lookup environment variables. Defaults to `envDefault`.
 * @param {boolean} useCache
 * @returns {string | undefined}
 */
export function whichSync(
    fileName: string,
    prependPath?: string[],
    useCache = true,
): string | undefined {
    if (isNullOrWhiteSpace(fileName)) {
        throw new ArgumentWhiteSpaceError("fileName");
    }

    const rootName = basename(fileName, extname(fileName));
    let location = executableCache[rootName];
    if (useCache && location !== undefined) {
        return location;
    }

    if (isAbsolute(fileName) && isFileSync(fileName)) {
        location = fileName;
        if (useCache) {
            executableCache[rootName] = location;
            executableCache[fileName] = location;
        }

        return location;
    }

    prependPath = prependPath?.map<string>((o) => {
        if (isAbsolute(o)) {
            return o;
        }

        return resolve(o);
    });

    const baseName = basename(fileName);
    const baseNameLowered = baseName.toLowerCase();

    const systemPaths = env.path.split()
        .filter((segment) => segment.length > 0)
        .map((segment) => env.expand(segment));

    const pathSegments = prependPath !== undefined ? prependPath.concat(systemPaths) : systemPaths;
    let pathExtSegments: string[] = [];

    if (WINDOWS) {
        const pe = env.get("PATHEXT") || "";
        const pathExtensions = !isNullOrWhiteSpace(pe)
            ? pe?.toLowerCase()
            : ".com;.exe;.bat;.cmd;.vbs;.vbe;.js;.jse;.wsf;.wsh";

        pathExtSegments = pathExtensions.split(";")
            .filter((segment) => !isNullOrWhiteSpace(segment));
    }

    for (const pathSegment of pathSegments) {
        if (isNullOrEmpty(pathSegment) || !isDirSync(pathSegment)) {
            continue;
        }

        if (WINDOWS) {
            const hasPathExt = pathExtSegments.find((segment) =>
                fileName.toLowerCase().endsWith(segment)
            ) !== undefined;

            if (!hasPathExt) {
                try {
                    let first: { name: string | undefined } | undefined;
                    for (const entry of readDirSync(pathSegment)) {
                        if (entry.isFile) {
                            for (const ext of pathExtSegments) {
                                if (entry.name?.toLowerCase() === baseNameLowered + ext) {
                                    first = entry;
                                    break;
                                }
                            }

                            if (first) {
                                break;
                            }
                        }
                    }

                    if (first?.name) {
                        location = join(pathSegment, first.name);
                        executableCache[rootName] = location;
                        executableCache[fileName] = location;

                        return location;
                    }
                } catch (e) {
                    // TODO: replace with debug trace writer
                    console.debug(e.toString());
                }
            } else {
                try {
                    let first: { name: string | undefined } | undefined;
                    for (const entry of readDirSync(pathSegment)) {
                        if (entry.isFile && entry.name?.toLowerCase() === baseNameLowered) {
                            first = entry;
                            break;
                        }
                    }

                    if (first?.name) {
                        location = join(pathSegment, first.name);
                        executableCache[rootName] = location;
                        executableCache[fileName] = location;

                        return location;
                    }
                } catch (e) {
                    console.debug(e.toString());
                }
            }
        } else {
            try {
                let first: { name: string | undefined } | undefined;
                for (const entry of readDirSync(pathSegment)) {
                    if (entry.isFile && entry.name?.toLowerCase() === baseNameLowered) {
                        first = entry;
                        break;
                    }
                }

                if (first?.name) {
                    location = join(pathSegment, first.name);
                    executableCache[rootName] = location;
                    executableCache[fileName] = location;

                    return location;
                }
            } catch (e) {
                console.debug(e.toString());
            }
        }
    }

    return undefined;
}

/**
 * which - Returns the full path of the executable file of the given program;
 * otherwise, returns undefined.
 *
 * @remarks The returned path is the full path of the executable file of the given program
 * if the program can be found in the system PATH environment variable or
 * using any of the paths from `prependedPaths` if specified.
 *
 * By default, `which` will cache the first lookup and then use the cache
 * for subsequent lookups unless `useCache` is set to false.
 *
 * @param {string} fileName The program file name.
 * @param {(string[] | undefined)} prependPath The paths to prepend to the PATH environment variable.
 * @param {IEnvironment} env The environment class to use to lookup environment variables. Defaults to `envDefault`.
 * @param {boolean} useCache
 * @returns {string | undefined}
 */
export async function which(
    fileName: string,
    prependPath?: string[],
    useCache = true,
): Promise<string | undefined> {
    if (isNullOrWhiteSpace(fileName)) {
        throw new ArgumentWhiteSpaceError("fileName");
    }

    const rootName = basename(fileName, extname(fileName));
    let location = executableCache[rootName];
    if (useCache && location !== undefined) {
        return location;
    }

    if (isAbsolute(fileName) && await isFile(fileName)) {
        location = fileName;
        if (useCache) {
            executableCache[rootName] = location;
            executableCache[fileName] = location;
        }

        return location;
    }

    prependPath = prependPath?.map<string>((o) => {
        if (isAbsolute(o)) {
            return o;
        }

        return resolve(o);
    });

    const baseName = basename(fileName);
    const baseNameLowered = baseName.toLowerCase();

    const systemPaths = env.path.split()
        .filter((segment) => segment.length)
        .map((segment) => env.expand(segment));

    const pathSegments = prependPath !== undefined ? prependPath.concat(systemPaths) : systemPaths;
    let pathExtSegments: string[] = [];

    if (WINDOWS) {
        const pe = env.get("PATHEXT") || "";
        const pathExtensions = !isNullOrWhiteSpace(pe)
            ? pe?.toLowerCase()
            : ".com;.exe;.bat;.cmd;.vbs;.vbe;.js;.jse;.wsf;.wsh";

        pathExtSegments = pathExtensions.split(";")
            .filter((segment) => !isNullOrWhiteSpace(segment));
    }

    for (const pathSegment of pathSegments) {
        if (isNullOrEmpty(pathSegment)) {
            continue;
        }

        const isDirectory = await isDir(pathSegment);
        if (!isDirectory) {
            continue;
        }

        if (WINDOWS) {
            const hasPathExt = pathExtSegments.find((segment) =>
                fileName.toLowerCase().endsWith(segment)
            ) !== undefined;

            if (!hasPathExt) {
                try {
                    let first: { name: undefined | string } | undefined;
                    for await (const entry of readDir(pathSegment)) {
                        if (!entry.isDirectory) {
                            for (const ext of pathExtSegments) {
                                if (entry.name?.toLowerCase() === baseNameLowered + ext) {
                                    first = entry;
                                    break;
                                }
                            }

                            if (first) {
                                break;
                            }
                        }
                    }

                    if (first?.name) {
                        location = join(pathSegment, first.name);
                        executableCache[rootName] = location;
                        executableCache[fileName] = location;

                        return location;
                    }
                } catch (e) {
                    // TODO: replace with debug trace writer
                    console.debug(e.toString());
                }
            } else {
                try {
                    let first: { name: undefined | string } | undefined;
                    for await (const entry of readDir(pathSegment)) {
                        if (
                            !entry.isDirectory &&
                            entry.name?.toLowerCase() === baseNameLowered
                        ) {
                            first = entry;
                            break;
                        }
                    }

                    if (first?.name) {
                        location = join(pathSegment, first.name);
                        executableCache[rootName] = location;
                        executableCache[fileName] = location;

                        return location;
                    }
                } catch (e) {
                    console.debug(e.toString());
                }
            }
        } else {
            try {
                let first: { name: undefined | string } | undefined;
                for await (const entry of readDir(pathSegment)) {
                    if (
                        !entry.isDirectory && entry.name?.toLowerCase() === baseNameLowered
                    ) {
                        first = entry;
                        break;
                    }
                }

                if (first?.name) {
                    location = join(pathSegment, first.name);
                    executableCache[rootName] = location;
                    executableCache[fileName] = location;

                    return location;
                }
            } catch (e) {
                console.debug(e.toString());
            }
        }
    }

    return undefined;
}
