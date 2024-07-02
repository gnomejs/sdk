import { NotImplementedError, NotSupportedError } from "@gnome/errors";
import { IntPtr } from "./intptr.ts";
import type { Pointer } from "./bun/ffi.d.ts";

/**
 * Creates a new IntPtr instance from the given value.
 *
 * @param value - The value to create the IntPtr from. It can be a bigint, number, ArrayBuffer, or unknown.
 * @returns The created IntPtr instance.
 * @throws NotImplementedError - If the function is not implemented.
 */
// deno-lint-ignore no-unused-vars
let createPointer = function (value: bigint | number | ArrayBuffer | unknown): IntPtr {
    throw new NotImplementedError("createPointer");
};

// deno-lint-ignore no-explicit-any
const g = globalThis as any;
if (typeof g.Deno !== "undefined") {
    const { DenoIntPtr } = await import("./deno/mod.ts");
    createPointer = function (value?: bigint | number | ArrayBuffer | unknown): IntPtr {
        if (value === undefined || value === null) {
            return new DenoIntPtr(0n);
        }

        if (typeof value === "object" && Object.getPrototypeOf(value) === null) {
            return new DenoIntPtr(value as Deno.PointerValue);
        }

        if (typeof value === "number") {
            value = BigInt(value);
            return new DenoIntPtr(value as bigint);
        }

        if (typeof value === "bigint") {
            return new DenoIntPtr(value as bigint);
        }

        throw new NotSupportedError(
            "createPointer for Deno must be a number, bigint, ArrayBuffer, or Deno.PointerValue",
        );
    };
} else if (typeof g.Bun !== "undefined") {
    const { BunIntPtr } = await import("./bun/mod.ts");

    createPointer = function (value?: bigint | number | ArrayBuffer | unknown): IntPtr {
        if (value === undefined || value === null) {
            return new BunIntPtr(new Uint8Array([0x0]));
        }

        if (typeof value === "object" && Object.getPrototypeOf(value) === null) {
            return new BunIntPtr(value as Pointer);
        }

        if (typeof value === "number") {
            return new BunIntPtr(new Uint8Array([value as number]));
        }

        if (ArrayBuffer.isView(value)) {
            return new BunIntPtr(value as unknown as ArrayBuffer);
        }

        throw new NotSupportedError("createPointer for Bun must be a number, ArrayBuffer, or Pointer");
    };
}

export { createPointer, IntPtr };
