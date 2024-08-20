import type { TypedArray } from "./base/types.ts";

export abstract class FFIStruct {
    abstract get buffer(): Uint8Array | null;
}

export class WideString extends FFIStruct {
    #buffer: Uint8Array | null;
    #string: string | null;

    constructor(buffer: Uint8Array | Uint16Array | Uint32Array | string | null | undefined) {
        super();
        if (buffer === null || buffer === undefined) {
            this.#buffer = null;
            this.#string = null;
            return;
        }

        if (typeof buffer === "string") {
            this.#string = buffer;
            this.#buffer = new Uint8Array(
                new Uint16Array(new TextEncoder().encode(buffer + "\0")).buffer,
            );
            return;
        }

        if (buffer instanceof Uint8Array) {
            this.#buffer = buffer;
        } else if (buffer instanceof Uint16Array || buffer instanceof Uint32Array) {
            this.#buffer = new Uint8Array(buffer.buffer);
        } else {
            throw new Error("Invalid buffer type");
        }

        if (this.#buffer[this.#buffer.length - 1] !== 0) {
            throw new Error("WideString must be null-terminated");
        }

        if (this.#buffer.length % 2 !== 0) {
            throw new Error("WideString must have an even number of bytes");
        }

        this.#string = null;
        if (this.#buffer.length > 0) {
            const view = new DataView(this.#buffer.buffer);
            const codes: number[] = [];
            for (let i = 0; i < view.byteLength; i += 2) {
                codes.push(view.getUint16(i, true));
            }

            this.#string = new TextDecoder("utf-16le").decode(new Uint16Array(codes));
        }
    }

    get buffer(): Uint8Array | null {
        return this.#buffer;
    }

    toString(): string {
        return this.#string ?? "";
    }
}

export class CString extends FFIStruct {
    #buffer: Uint8Array | null;
    #string: string | null;

    constructor(buffer: Uint8Array | Uint32Array | string | null | undefined) {
        super();
        if (buffer === null || buffer === undefined) {
            this.#buffer = null;
            this.#string = null;
            return;
        }

        if (typeof buffer === "string") {
            this.#buffer = new Uint8Array(
                new TextEncoder().encode(buffer + "\0"),
            );
            this.#string = buffer;
            return;
        }

        if (buffer instanceof Uint8Array) {
            this.#buffer = buffer;
        } else if (buffer instanceof Uint32Array) {
            this.#buffer = new Uint8Array(buffer.buffer);
        } else {
            throw new Error("Invalid buffer type");
        }

        if (this.#buffer[this.#buffer.length - 1] !== 0) {
            const old = this.#buffer;
            this.#buffer = new Uint8Array(this.#buffer.length + 1);
            this.#buffer.set(old);
        }

        this.#string = new TextDecoder().decode(buffer.slice(0, buffer.length - 1));
    }

    get isNull(): boolean {
        return this.#buffer === null;
    }

    get buffer(): Uint8Array | null {
        return this.#buffer;
    }

    toString(): string {
        return this.#string ?? "";
    }
}

/**
 * Represents a platform-specific integer pointer.
 */
export class Ptr {
    #ptr: unknown | null;

    constructor(ptr: unknown | null) {
        this.#ptr = ptr;
    }

    /**
     * Checks if the integer pointer is null.
     * @returns `true` if the integer pointer is null, `false` otherwise.
     */
    get isNull(): boolean {
        return this.#ptr === null;
    }

    /**
     * Converts the integer pointer to a native pointer of type `T`.
     * @returns The native pointer of type `T`.
     * @template T - The type of the native pointer.
     */
    toPtr<TPtr>(): TPtr {
        return this.#ptr as TPtr;
    }
}

export function cstring(value?: string | null | Uint8Array | Uint32Array): CString {
    return new CString(value);
}

export function wideString(value?: string | null | Uint8Array | Uint16Array | Uint32Array): WideString {
    return new WideString(value);
}

export function fromCString(value?: string | null | Uint8Array | Uint32Array): string {
    return cstring(value).toString();
}

export function fromWideString(value?: string | null | Uint8Array | Uint16Array | Uint32Array): string {
    return wideString(value).toString();
}

// deno-lint-ignore no-unused-vars
let ptr = function (value: TypedArray | DataView | ArrayBuffer | FFIStruct): Ptr {
    throw new Error("Not implemented");
};

// deno-lint-ignore no-explicit-any
const g = globalThis as any;
if (g.Deno) {
    ptr = function (value: TypedArray | DataView | ArrayBuffer | FFIStruct): Ptr {
        if (value instanceof FFIStruct) {
            const buffer = value.buffer;
            if (buffer === null) {
                return new Ptr(null);
            } else {
                const intptr = Deno.UnsafePointer.of(buffer);
                return new Ptr(intptr);
            }
        } else {
            const intptr = Deno.UnsafePointer.of(value);
            return new Ptr(intptr);
        }
    };
} else if (g.Bun) {
    const ffi = await import("./bun/mod.ts");
    ptr = function (value: TypedArray | DataView | ArrayBuffer | FFIStruct): Ptr {
        if (value instanceof FFIStruct) {
            const buffer = value.buffer;
            if (buffer === null) {
                return new Ptr(null);
            } else {
                return new Ptr(ffi.ptr(buffer));
            }
        } else {
            return new Ptr(ffi.ptr(value));
        }
    };
}

export { ptr };
