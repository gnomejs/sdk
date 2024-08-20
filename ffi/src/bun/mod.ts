/**
 * Enables the bun ffi module to be imported within modules
 * that use the deno language server to providing cross runtime
 * modules that ship to jsr.io
 *
 * The module provides the Bun implementation of the IntPtr class.
 *
 * @module
 */
import type * as bunFFI from "./ffi.d.ts";
import type { Pointer } from "./ffi.d.ts";

// deno-lint-ignore no-explicit-any
const g = globalThis as any;
if (typeof g.Bun === "undefined") {
    throw new Error("the ffi/bun module requires the Bun runtime.");
}

// @ts-types="bun-types"
const bunFFISpecifier = "bun:ffi";
const ffi = await import(bunFFISpecifier) as typeof bunFFI

export const dlopen = ffi.dlopen;
export const FFIType = ffi.FFIType;
export const ptr = ffi.ptr;
export const CString = ffi.CString;
export const CFunction = ffi.CFunction;
export const toArrayBuffer = ffi.toArrayBuffer;
export const read = ffi.read;

export type { Pointer };

export default ffi;