import { basename } from "@std/path";
import type { FileInfo, FsFile, FsSupports, SeekMode } from "../types.ts";
import fs from "node:fs";
import { BUN, DENO } from "@gnome/runtime-constants";

// deno-lint-ignore no-unused-vars
let lockFile = (fd: number, exclusive?: boolean): Promise<void> => Promise.reject(new Error("Not implemented"));
// deno-lint-ignore no-unused-vars
let lockFileSync = (fd: number, exclusive?: boolean): void => {
    throw new Error("Not implemented");
};
// deno-lint-ignore no-unused-vars
let unlockFile = (fd: number): Promise<void> => Promise.reject(new Error("Not implemented"));
// deno-lint-ignore no-unused-vars
let unlockFileSync = (fd: number): void => {
    throw new Error("Not implemented");
};
// deno-lint-ignore no-unused-vars
let seekFile = (fd: number, offset: number | bigint, whence?: SeekMode): Promise<number> =>
    Promise.reject(new Error("Not implemented"));
// deno-lint-ignore no-unused-vars
let seekFileSync = (fd: number, offset: number | bigint, whence?: SeekMode): number => {
    throw new Error("Not implemented");
};

const defaultSupports: FsSupports[] = [];

function translate(whence?: SeekMode): number {
    switch (whence) {
        case "start":
            return 0;
        case "current":
            return 1;
        case "end":
            return 2;
        default:
            return 0;
    }
}

try {
    // deno-lint-ignore no-explicit-any
    const g = globalThis as any;
    let load = !DENO && !BUN;
    if (g._LOAD_NODE_FS_EXT === false) {
        load = false;
    }

    if (load) {
        const { flock, flockSync, fseek, fseekSync } = await import("npm:fs-ext@2.0.0");
        lockFile = (fd: number, exclusive?: boolean) =>
            new Promise((resolve, reject) => {
                flock(fd, exclusive ? "ex" : "sh", (err: unknown) => {
                    if (err) reject(err);
                    resolve();
                });
            });

        lockFileSync = (fd: number, exclusive?: boolean) => {
            flockSync(fd, exclusive ? "ex" : "sh");
        };

        unlockFile = (fd: number) =>
            new Promise((resolve, reject) => {
                flock(fd, "un", (err: unknown) => {
                    if (err) reject(err);
                    resolve();
                });
            });

        unlockFileSync = (fd: number) => {
            flockSync(fd, "un");
        };

        seekFile = (fd: number, offset: number | bigint, whence?: SeekMode) =>
            new Promise<number>((resolve, reject) => {
                fseek(fd, offset, translate(whence), (err: unknown, pos: number) => {
                    if (err) reject(err);
                    resolve(pos);
                });
            });

        seekFileSync = (fd: number, offset: number | bigint, whence?: SeekMode): number => {
            return fseekSync(fd, offset, translate(whence));
        };

        defaultSupports.push("lock", "seek");
    }
} catch {
    // do nothing
}

export class File implements FsFile {
    #fd: number;
    #path: string;
    #supports: FsSupports[] = [];
    #readable?: ReadableStream<Uint8Array>;
    #writeable?: WritableStream<Uint8Array>;

    constructor(fd: number, path: string, supports: FsSupports[] = []) {
        this.#fd = fd;
        this.#path = path;
        this.#supports = supports.concat(defaultSupports);
    }

    [x: string]: unknown;

    [Symbol.dispose](): void {
        this.closeSync();
    }

    [Symbol.asyncDispose](): Promise<void> {
        return this.close();
    }

    get readable(): ReadableStream<Uint8Array> {
        const fd = this.#fd;
        this.#readable ??= new ReadableStream({
            start: (controller) => {
                while (true) {
                    const buf = new Uint8Array(1024);
                    const size = this.readSync(buf);
                    if (size === null) {
                        controller.close();
                        this.closeSync();
                        break;
                    }
                    controller.enqueue(buf.slice(0, size));
                }
            },
            cancel() {
                fs.closeSync(fd);
            },
        });

        return this.#readable;
    }

    get writeable(): WritableStream<Uint8Array> {
        const fd = this.#fd;
        this.#writeable ??= new WritableStream({
            write(chunk, controller) {
                return new Promise((resolve) => {
                    fs.write(fd, chunk, (err) => {
                        if (err) {
                            controller.error(err);
                            return;
                        }

                        resolve();
                    });
                });
            },
            close() {
                fs.closeSync(fd);
            },
        });

        return this.writeable;
    }

    get supports(): FsSupports[] {
        return this.#supports;
    }

    closeSync(): void {
        fs.closeSync(this.#fd);
    }

    close(): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.close(this.#fd, (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    flush(): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.fsync(this.#fd, (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    flushSync(): void {
        fs.fsyncSync(this.#fd);
    }

    flushData(): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.fdatasync(this.#fd, (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }
    flushDataSync(): void {
        return fs.fdatasyncSync(this.#fd);
    }

    lock(exclusive?: boolean | undefined): Promise<void> {
        return lockFile(this.#fd, exclusive);
    }
    lockSync(exclusive?: boolean | undefined): void {
        return lockFileSync(this.#fd, exclusive);
    }
    readSync(p: Uint8Array): number | null {
        const v = fs.readSync(this.#fd, p);
        if (v < 1) {
            return null;
        }

        return v;
    }
    read(p: Uint8Array): Promise<number | null> {
        return new Promise((resolve, reject) => {
            fs.read(this.#fd, p, 0, p.length, null, (err, size) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(size);
            });
        });
    }

    seekSync(offset: number | bigint, whence?: SeekMode | undefined): number {
        return seekFileSync(this.#fd, offset, whence);
    }

    seek(offset: number | bigint, whence?: SeekMode | undefined): Promise<number> {
        return seekFile(this.#fd, offset, whence);
    }

    stat(): Promise<FileInfo> {
        return new Promise((resolve, reject) => {
            fs.fstat(this.#fd, (err, stat) => {
                if (err) {
                    reject(err);
                    return;
                }

                const p = this.#path;
                resolve({
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
                } as FileInfo);
            });
        });
    }

    statSync(): FileInfo {
        const p = this.#path;
        const stat = fs.fstatSync(this.#fd);
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
    }

    writeSync(p: Uint8Array): number {
        return fs.writeSync(this.#fd, p);
    }
    write(p: Uint8Array): Promise<number> {
        return new Promise((resolve, reject) => {
            fs.write(this.#fd, p, (err, size) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(size);
            });
        });
    }

    unlock(): Promise<void> {
        return unlockFile(this.#fd);
    }

    unlockSync(): void {
        return unlockFileSync(this.#fd);
    }
}
