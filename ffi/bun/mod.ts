/**
 * Enables the bun ffi module to be imported within modules
 * that use the deno language server to providing cross runtime
 * modules that ship to jsr.io
 *
 * The module provides the Bun implementation of the IntPtr class.
 *
 * @module
 */

import { IntPtr } from "../intptr.ts";
import type * as bunFFI from "./ffi.d.ts";
import type { Pointer } from "./ffi.d.ts";

// deno-lint-ignore no-explicit-any
const g = globalThis as any;
if (typeof g.Bun === "undefined") {
    throw new Error("the ffi/bun module requires the Bun runtime.");
}

const bunFFISpecifier = "bun:ffi";
const ffi = await import(bunFFISpecifier);

export const dlopen = ffi.dlopen as typeof bunFFI.dlopen;
export const FFIType = ffi.FFIType as typeof bunFFI.FFIType;
export const ptr = ffi.ptr as typeof bunFFI.ptr;
export const CString = ffi.CString as typeof bunFFI.CString;
export const CFunction = ffi.CFunction as typeof bunFFI.CFunction;
export const toArrayBuffer = ffi.toArrayBuffer as typeof bunFFI.toArrayBuffer;
export const read = ffi.read as typeof bunFFI.read;
export const nullPtr: Pointer = ptr(new Uint8Array([0x0]));

export type { Pointer };

export class BunIntPtr extends IntPtr {
    #value: number;
    #ptr: Pointer;

    constructor(value: ArrayBuffer | Pointer | number) {
        super();
        if (typeof value === "number") {
            this.#value = value;
            const v = value as number & { __pointer__: null };
            v.__pointer__ = null;
            this.#ptr = v;

            return;
        }

        if (value instanceof ArrayBuffer) {
            this.#ptr = ptr(value);
            this.#value = this.#ptr as number;
        } else {
            this.#ptr = value;
            this.#value = value as number;
        }
    }

    get value(): number {
        return this.#value;
    }
    set value(value: number) {
        this.#value = value;
    }
    set nativePtr(value: unknown) {
        this.#ptr = value as Pointer;
    }

    get nativePtr(): unknown {
        return this.#ptr;
    }

    get raw(): Pointer {
        return this.#ptr;
    }

    slice(offset: number): IntPtr {
        return new BunIntPtr(read.ptr(this.#ptr, offset) as Pointer);
    }

    toCString(offset?: number | undefined): string {
        return new CString(this.#ptr, offset) as unknown as string;
    }

    toPwStr(offset?: number | undefined): string {
        const buffer = this.toBuffer(offset);
        const view = new DataView(buffer);
        const codes: number[] = [];
        for (let i = 0; i < view.byteLength; i += 2) {
            const c = view.getUint16(i, true);
            if (c === 0) {
                break;
            }

            codes.push(c);
        }

        return String.fromCharCode(...codes);
    }

    toBuffer(offset?: number | undefined, length?: number | undefined): ArrayBuffer {
        return toArrayBuffer(this.#ptr, offset, length);
    }
}
