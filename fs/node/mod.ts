import fs from "node:fs";
import fsa from "node:fs/promises";
import process from "node:process";
import { basename, join } from "node:path";

import type {
    CreateDirectoryOptions,
    DirectoryInfo,
    FileInfo,
    MakeTempOptions,
    ReadOptions,
    RemoveOptions,
    SymlinkOptions,
    WriteOptions,
} from "../types.ts";

const WIN = process.platform === "win32";

export function uid(): number | null {
    if (process.getuid === undefined) {
        return null;
    }

    const uid = process.getuid();
    if (uid === -1 || uid === undefined) {
        return null;
    }

    return uid;
}

export function gid(): number | null {
    if (process.getgid === undefined) {
        return null;
    }

    const gid = process.getgid();
    if (gid === -1 || gid === undefined) {
        return null;
    }

    return gid;
}

export function cwd(): string {
    return process.cwd();
}

function randomName(prefix?: string, suffix?: string): string {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const rng = crypto.getRandomValues(new Uint8Array(12));
    const name = Array.from(rng)
        .map((x) => chars[x % chars.length])
        .join("");

    if (prefix && suffix) {
        return `${prefix}-${name}${suffix}`;
    }

    if (prefix) {
        return `${prefix}-${name}`;
    }

    if (suffix) {
        return `${name}${suffix}`;
    }

    return name;
}

export async function copyFile(
    src: string | URL,
    dest: string | URL,
): Promise<void> {
    return await fsa.copyFile(src, dest);
}

export function copyFileSync(
    src: string | URL,
    dest: string | URL,
): void {
    fs.copyFileSync(src, dest);
}

export function isDir(path: string | URL): Promise<boolean> {
    return fsa.stat(path)
        .then((stat) => stat.isDirectory())
        .catch(() => false);
}

export function isDirSync(path: string | URL): boolean {
    try {
        return fs.statSync(path).isDirectory();
    } catch {
        return false;
    }
}

export function isFile(path: string | URL): Promise<boolean> {
    return fsa.stat(path)
        .then((stat) => stat.isFile())
        .catch(() => false);
}

export function isFileSync(path: string | URL): boolean {
    try {
        return fs.statSync(path).isFile();
    } catch {
        return false;
    }
}

export function link(oldPath: string | URL, newPath: string | URL): Promise<void> {
    return fsa.link(oldPath, newPath);
}

export function linkSync(oldPath: string | URL, newPath: string | URL): void {
    fs.linkSync(oldPath, newPath);
}

export function lstat(path: string | URL): Promise<FileInfo> {
    return fsa.lstat(path).then((stat) => {
        const p = path instanceof URL ? path.toString() : path;
        return {
            isFile: stat.isFile(),
            isDirectory: stat.isDirectory(),
            isSymlink: stat.isSymbolicLink(),
            name: basename(p),
            path: p,
            size: stat.size,
            birthtime: stat.birthtime,
            mtime: stat.mtime,
            atime: stat.atime,
            mode: stat.mode,
            uid: stat.uid,
            gid: stat.gid,
            dev: stat.dev,
            blksize: stat.blksize,
            ino: stat.ino,
            nlink: stat.nlink,
            rdev: stat.rdev,
            blocks: stat.blocks,
            isBlockDevice: stat.isBlockDevice(),
            isCharDevice: stat.isCharacterDevice(),
            isSocket: stat.isSocket(),
            isFifo: stat.isFIFO(),
        } as FileInfo;
    });
}

export function lstatSync(path: string | URL): FileInfo {
    const stat = fs.lstatSync(path);
    const p = path instanceof URL ? path.toString() : path;
    return {
        isFile: stat.isFile(),
        isDirectory: stat.isDirectory(),
        isSymlink: stat.isSymbolicLink(),
        name: basename(p),
        path: p,
        size: stat.size,
        birthtime: stat.birthtime,
        mtime: stat.mtime,
        atime: stat.atime,
        mode: stat.mode,
        uid: stat.uid,
        gid: stat.gid,
        dev: stat.dev,
        blksize: stat.blksize,
        ino: stat.ino,
        nlink: stat.nlink,
        rdev: stat.rdev,
        blocks: stat.blocks,
        isBlockDevice: stat.isBlockDevice(),
        isCharDevice: stat.isCharacterDevice(),
        isSocket: stat.isSocket(),
        isFifo: stat.isFIFO(),
    };
}

export function chmod(path: string | URL, mode: number): Promise<void> {
    return fsa.chmod(path, mode);
}

export function chmodSync(path: string | URL, mode: number): void {
    fs.chmodSync(path, mode);
}

export function chown(
    path: string | URL,
    uid: number,
    gid: number,
): Promise<void> {
    return fsa.chown(path, uid, gid);
}

export function chownSync(path: string | URL, uid: number, gid: number): void {
    fs.chownSync(path, uid, gid);
}

export function makeTempDirSync(options?: MakeTempOptions): string {
    options ??= {};
    options.prefix ??= "tmp";

    if (!options.dir) {
        options.dir = WIN ? (process.env.TEMP ?? "c:\\Temp") : (process.env.TMPDIR ?? "/tmp");
    }

    let dir = options.dir;
    if (options.prefix) {
        dir = join(dir, options.prefix);
    }

    return fs.mkdtempSync(dir);
}

export async function makeTempDir(options?: MakeTempOptions): Promise<string> {
    options ??= {};
    options.prefix ??= "tmp";

    if (!options.dir) {
        options.dir = WIN ? (process.env.TEMP ?? "c:\\Temp") : (process.env.TMPDIR ?? "/tmp");
    }

    let dir = options.dir;
    if (options.prefix) {
        dir = join(dir, options.prefix);
    }

    return await fsa.mkdtemp(dir);
}

export function makeTempFileSync(options?: MakeTempOptions): string {
    options ??= {};
    options.prefix ??= "tmp";

    if (!options.dir) {
        options.dir = WIN ? (process.env.TEMP ?? "c:\\Temp") : (process.env.TMPDIR ?? "/tmp");
    }

    const r = randomName(options.prefix, options.suffix);
    const sep = WIN ? "\\" : "/";

    makeDirSync(options.dir, { recursive: true });

    const file = `${options.dir}${sep}${r}`;

    fs.writeFileSync(file, new Uint8Array(0), { mode: 0o644 });
    return file;
}

export async function makeTempFile(options?: MakeTempOptions): Promise<string> {
    options ??= {};
    options.prefix ??= "tmp";

    let dir: string;
    if (!options.dir) {
        dir = WIN ? (process.env.TEMP ?? "c:\\Temp") : (process.env.TMPDIR ?? "/tmp");
    } else {
        dir = options.dir;
    }

    const r = randomName(options.prefix, options.suffix);
    const sep = WIN ? "\\" : "/";

    await makeDir(dir, { recursive: true });

    const file = `${options.dir}${sep}${r}`;

    fs.writeFileSync(file, new Uint8Array(0), { mode: 0o644 });

    return file;
}

export async function makeDir(
    path: string | URL,
    options?: CreateDirectoryOptions | undefined,
): Promise<void> {
    await fsa.mkdir(path, options);
}

export function makeDirSync(
    path: string | URL,
    options?: CreateDirectoryOptions | undefined,
): void {
    fs.mkdirSync(path, options);
}

export function stat(path: string | URL): Promise<FileInfo> {
    return fsa.stat(path).then((stat) => {
        const p = path instanceof URL ? path.toString() : path;
        console.log(path, stat.isSymbolicLink());
        return {
            isFile: stat.isFile(),
            isDirectory: stat.isDirectory(),
            isSymlink: stat.isSymbolicLink(),
            name: basename(p),
            path: p,
            size: stat.size,
            birthtime: stat.birthtime,
            mtime: stat.mtime,
            atime: stat.atime,
            mode: stat.mode,
            uid: stat.uid,
            gid: stat.gid,
            dev: stat.dev,
            blksize: stat.blksize,
            ino: stat.ino,
            nlink: stat.nlink,
            rdev: stat.rdev,
            blocks: stat.blocks,
            isBlockDevice: stat.isBlockDevice(),
            isCharDevice: stat.isCharacterDevice(),
            isSocket: stat.isSocket(),
            isFifo: stat.isFIFO(),
        };
    });
}

export function isNotFoundError(err: unknown): boolean {
    if (!(err instanceof Error)) {
        return false;
    }

    // deno-lint-ignore no-explicit-any
    return (err as any).code === "ENOENT";
}

export function isAlreadyExistsError(err: unknown): boolean {
    if (!(err instanceof Error)) {
        return false;
    }

    // deno-lint-ignore no-explicit-any
    return (err as any).code === "EEXIST";
}

export function statSync(path: string | URL): FileInfo {
    const stat = fs.statSync(path);
    const p = path instanceof URL ? path.toString() : path;

    return {
        isFile: stat.isFile(),
        isDirectory: stat.isDirectory(),
        isSymlink: stat.isSymbolicLink(),
        name: basename(p),
        path: p,
        size: stat.size,
        birthtime: stat.birthtime,
        mtime: stat.mtime,
        atime: stat.atime,
        mode: stat.mode,
        uid: stat.uid,
        gid: stat.gid,
        dev: stat.dev,
        blksize: stat.blksize,
        ino: stat.ino,
        nlink: stat.nlink,
        rdev: stat.rdev,
        blocks: stat.blocks,
        isBlockDevice: stat.isBlockDevice(),
        isCharDevice: stat.isCharacterDevice(),
        isSocket: stat.isSocket(),
        isFifo: stat.isFIFO(),
    };
}

export function readDir(
    path: string | URL,
): AsyncIterable<DirectoryInfo> {
    if (path instanceof URL) {
        path = path.toString();
    }

    const iterator = async function* () {
        const data = await fsa.readdir(path);
        for (const d of data) {
            const info = await lstat(join(path, d));

            yield {
                name: d,
                isFile: info.isFile,
                isDirectory: info.isDirectory,
                isSymlink: info.isSymlink,
            };
        }
    };

    return iterator();
}

export function* readDirSync(
    path: string | URL,
): Iterable<DirectoryInfo> {
    if (path instanceof URL) {
        path = path.toString();
    }

    const data = fs.readdirSync(path);
    for (const d of data) {
        const info = lstatSync(join(path, d));

        yield {
            name: d,
            isFile: info.isFile,
            isDirectory: info.isDirectory,
            isSymlink: info.isSymlink,
        };
    }
}

export function readLink(path: string | URL): Promise<string> {
    return fsa.readlink(path);
}

export function readLinkSync(path: string | URL): string {
    return fs.readlinkSync(path);
}

export function readTextFileSync(path: string | URL): string {
    return fs.readFileSync(path, { encoding: "utf8" });
}

export function readTextFile(path: string | URL, options?: ReadOptions): Promise<string> {
    if (options?.signal) {
        options.signal.throwIfAborted();
        // deno-lint-ignore no-explicit-any
        const g = globalThis as any;

        if (!g.AbortController) {
            throw new Error("AbortController not available");
        }
        const c = new g.AbortController();
        c.signal = options.signal;

        options.signal.onabort = () => {
            c.abort();
        };

        return fsa.readFile(path, { encoding: "utf8", signal: c.signal });
    }

    return fsa.readFile(path, { encoding: "utf8" });
}

export function readFile(path: string | URL, options?: ReadOptions): Promise<Uint8Array> {
    if (options?.signal) {
        options.signal.throwIfAborted();
        // deno-lint-ignore no-explicit-any
        const g = globalThis as any;

        if (!g.AbortController) {
            throw new Error("AbortController not available");
        }
        const c = new g.AbortController();
        c.signal = options.signal;

        options.signal.onabort = () => {
            c.abort();
        };

        return fsa.readFile(path, { signal: c.signal });
    }

    return fsa.readFile(path);
}

export function readFileSync(path: string | URL): Uint8Array {
    return fs.readFileSync(path);
}

export function realPath(path: string | URL): Promise<string> {
    return fsa.realpath(path);
}

export function realPathSync(path: string | URL): string {
    return fs.realpathSync(path);
}

export function rename(
    oldPath: string | URL,
    newPath: string | URL,
): Promise<void> {
    return fsa.rename(oldPath, newPath);
}

export function renameSync(oldPath: string | URL, newPath: string | URL): void {
    return fs.renameSync(oldPath, newPath);
}

export async function remove(
    path: string | URL,
    options?: RemoveOptions,
): Promise<void> {
    const isFolder = await isDir(path);
    if (isFolder) {
        return await fsa.rmdir(path, { ...options });
    }

    return fsa.rm(path, { ...options, force: true });
}

export function removeSync(path: string | URL, options?: RemoveOptions): void {
    const isFolder = isDirSync(path);
    if (isFolder) {
        return fs.rmdirSync(path, { ...options });
    }

    return fs.rmSync(path, { ...options, force: true });
}

export function symlink(
    target: string | URL,
    path: string | URL,
    opttions?: SymlinkOptions,
): Promise<void> {
    return fsa.symlink(target, path, opttions?.type);
}

export function symlinkSync(
    target: string | URL,
    path: string | URL,
    options?: SymlinkOptions,
): void {
    fs.symlinkSync(target, path, options?.type);
}

export function writeTextFileSync(
    path: string | URL,
    data: string,
    options?: WriteOptions,
): void {
    const o: fs.WriteFileOptions = {};
    o.mode = options?.mode;
    o.encoding = "utf8";
    o.flag = options?.append ? "a" : "w";
    if (options?.create) {
        o.flag += "+";
    }
    o.encoding = "utf8";
    if (options?.signal) {
        options.signal.throwIfAborted();
        // deno-lint-ignore no-explicit-any
        const g = globalThis as any;

        if (!g.AbortController) {
            throw new Error("AbortController not available");
        }
        const c = new g.AbortController();
        c.signal = options.signal;

        options.signal.onabort = () => {
            c.abort();
        };

        o.signal = c.signal;
    }
    fs.writeFileSync(path, data, o);
}

export async function writeTextFile(
    path: string | URL,
    data: string,
    options?: WriteOptions,
): Promise<void> {
    const o: fs.WriteFileOptions = {};
    o.mode = options?.mode;
    o.encoding = "utf8";
    o.flag = options?.append ? "a" : "w";
    if (options?.create) {
        o.flag += "+";
    }
    o.encoding = "utf8";
    if (options?.signal) {
        options.signal.throwIfAborted();
        // deno-lint-ignore no-explicit-any
        const g = globalThis as any;

        if (!g.AbortController) {
            throw new Error("AbortController not available");
        }
        const c = new g.AbortController();
        c.signal = options.signal;

        options.signal.onabort = () => {
            c.abort();
        };

        o.signal = c.signal;
    }

    await fsa.writeFile(path, data, o);
}

export function writeFile(
    path: string | URL,
    data: Uint8Array | ReadableStream<Uint8Array>,
    options?: WriteOptions | undefined,
): Promise<void> {
    if (data instanceof ReadableStream) {
        const sr = fs.createWriteStream(path, options);
        const writer = new WritableStream({
            write(chunk) {
                sr.write(chunk);
            },
        });

        return data.pipeTo(writer).finally(() => {
            sr.close();
        });
    }

    const o: fs.WriteFileOptions = {};
    o.mode = options?.mode;
    o.flag = options?.append ? "a" : "w";
    if (options?.create) {
        o.flag += "+";
    }
    o.encoding = "utf8";
    if (options?.signal) {
        options.signal.throwIfAborted();
        // deno-lint-ignore no-explicit-any
        const g = globalThis as any;

        if (!g.AbortController) {
            throw new Error("AbortController not available");
        }
        const c = new g.AbortController();
        c.signal = options.signal;

        options.signal.onabort = () => {
            c.abort();
        };

        o.signal = c.signal;
    }

    return fsa.writeFile(path, data, o);
}

export function writeFileSync(
    path: string | URL,
    data: Uint8Array,
    options?: WriteOptions | undefined,
): void {
    const o: fs.WriteFileOptions = {};
    o.mode = options?.mode;
    o.flag = options?.append ? "a" : "w";
    if (options?.create) {
        o.flag += "+";
    }
    o.encoding = "utf8";
    if (options?.signal) {
        options.signal.throwIfAborted();
        // deno-lint-ignore no-explicit-any
        const g = globalThis as any;

        if (!g.AbortController) {
            throw new Error("AbortController not available");
        }
        const c = new g.AbortController();
        c.signal = options.signal;

        options.signal.onabort = () => {
            c.abort();
        };

        o.signal = c.signal;
    }

    fs.writeFileSync(path, data, o);
}

export function utime(
    path: string | URL,
    atime: number | Date,
    mtime: number | Date,
): Promise<void> {
    return fsa.utimes(path, atime, mtime);
}

export function utimeSync(
    path: string | URL,
    atime: number | Date,
    mtime: number | Date,
): void {
    fs.utimesSync(path, atime, mtime);
}
