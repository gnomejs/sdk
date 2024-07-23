import { basename } from "@std/path";
import type { FileInfo, FsFile, FsSupports, SeekMode } from "../types.ts";

function translate(whence?: SeekMode): Deno.SeekMode {
    whence ??= "current";
    switch (whence) {
        case "start":
            return Deno.SeekMode.Start;
        case "current":
            return Deno.SeekMode.Current;
        case "end":
            return Deno.SeekMode.End;
        default:
            return Deno.SeekMode.Current;
    }
}

export class File implements FsFile {
    #file: Deno.FsFile;
    #path: string;
    #supports: FsSupports[] = [];

    constructor(file: Deno.FsFile, path: string, supports: FsSupports[] = []) {
        this.#file = file;
        this.#path = path;
        this.#supports = supports;
    }

    [key: string]: unknown;

    get readable(): ReadableStream<Uint8Array> {
        return this.#file.readable;
    }

    get writeable(): WritableStream<Uint8Array> {
        return this.#file.writable;
    }

    get supports(): FsSupports[] {
        return this.#supports;
    }

    [Symbol.dispose](): void {
        this.#file.close();
    }

    [Symbol.asyncDispose](): Promise<void> {
        return this.close();
    }

    close(): Promise<void> {
        return Promise.resolve(this.#file.close());
    }

    closeSync(): void {
        this.#file.close();
    }

    flush(): Promise<void> {
        return this.#file.sync();
    }

    flushSync(): void {
        return this.#file.syncSync();
    }

    flushData(): Promise<void> {
        return this.#file.syncData();
    }

    flushDataSync(): void {
        return this.#file.syncDataSync();
    }

    lock(exclusive?: boolean | undefined): Promise<void> {
        return this.#file.lock(exclusive);
    }

    lockSync(exclusive?: boolean | undefined): void {
        return this.#file.lockSync(exclusive);
    }

    readSync(buffer: Uint8Array): number | null {
        return this.#file.readSync(buffer);
    }

    read(buffer: Uint8Array): Promise<number | null> {
        return this.#file.read(buffer);
    }

    seek(offset: number | bigint, whence?: SeekMode | undefined): Promise<number> {
        return this.#file.seek(offset, translate(whence));
    }

    seekSync(offset: number | bigint, whence?: SeekMode): number {
        return this.#file.seekSync(offset, translate(whence));
    }

    stat(): Promise<FileInfo> {
        return this.#file.stat().then((stat) => {
            const p = this.#path;
            return {
                isFile: stat.isFile,
                isDirectory: stat.isDirectory,
                isSymlink: stat.isSymlink,
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
                isBlockDevice: stat.isBlockDevice,
                isCharDevice: stat.isCharDevice,
                isSocket: stat.isSocket,
                isFifo: stat.isFifo,
            } as FileInfo;
        });
    }

    statSync(): FileInfo {
        const p = this.#path;
        const stat = this.#file.statSync();
        return {
            isFile: stat.isFile,
            isDirectory: stat.isDirectory,
            isSymlink: stat.isSymlink,
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
            isBlockDevice: stat.isBlockDevice,
            isCharDevice: stat.isCharDevice,
            isSocket: stat.isSocket,
            isFifo: stat.isFifo,
        } as FileInfo;
    }

    writeSync(buffer: Uint8Array): number {
        return this.#file.writeSync(buffer);
    }

    write(buffer: Uint8Array): Promise<number> {
        return this.#file.write(buffer);
    }

    unlock(): Promise<void> {
        return this.#file.unlock();
    }

    unlockSync(): void {
        this.#file.unlockSync();
    }
}
