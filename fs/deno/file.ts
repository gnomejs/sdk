import { SeekMode, FsFile, FileInfo, FsSupports } from "../types.ts";

function translate(whence?: SeekMode) : Deno.SeekMode {
    whence ??= 'current'
    switch(whence)
    {
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
    #file: Deno.FsFile
    #path: string 
    #supports: FsSupports[] = []
    
    constructor(file: Deno.FsFile, path: string) {
        this.#file = file;
        this.#path = path;
    }

    [key: string] : unknown 
  
    get readable() : ReadableStream<Uint8Array> {
        return this.#file.readable;
    }

    get writeable() : WritableStream<Uint8Array> {
        return this.#file.writable
    }
    
    get supports() : FsSupports[] {
        return this.#supports;
    }

    [Symbol.dispose](): void {
        this.#file.close();
    }

    close(): void {
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
        return this.#file.stat();
    }

    statSync(): FileInfo {
        throw new Error("Method not implemented.");
    }

  
    writeSync(data: Uint8Array): number {
        throw new Error("Method not implemented.");
    }
    
    write(data: Uint8Array): Promise<number> {
        throw new Error("Method not implemented.");
    }
    
    unlock(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    unlockSync(): void {
        throw new Error("Method not implemented.");
    }
    
    
}