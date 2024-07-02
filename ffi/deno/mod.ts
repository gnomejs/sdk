import { IntPtr } from "../intptr.ts";

export const nullPtr: Deno.PointerValue = Deno.UnsafePointer.of(new Uint8Array([0x0]));
export class DenoIntPtr extends IntPtr {
    #value: number;
    #nativePtr: Deno.PointerValue;
    #length?: number;

    constructor(value: bigint | ArrayBuffer | Deno.PointerValue) {
        super();

        if (typeof value === "bigint") {
            this.#nativePtr = Deno.UnsafePointer.create(value);
            if (this.#nativePtr === null) {
                this.#value = 0;
                return;
            }

            this.#value = Number(value);
        } else if (value instanceof ArrayBuffer) {
            this.#length = value.byteLength;
            const ptr = Deno.UnsafePointer.of(value);
            this.#nativePtr = ptr;
            if (ptr === null) {
                this.#value = 0;
                return;
            }
            this.#value = Number(Deno.UnsafePointer.value(ptr));
        } else {
            if (value === null) {
                this.#value = 0;
                this.#nativePtr = null;
                return;
            }

            this.#value = Number(Deno.UnsafePointer.value(value));
            this.#nativePtr = value;
        }
    }

    get value(): number {
        return this.#value;
    }
    set value(value: number) {
        this.#value = value;
    }
    set nativePtr(value: unknown) {
        this.#nativePtr = value as Deno.PointerValue;
    }

    get nativePtr(): unknown {
        return this.#nativePtr;
    }

    get raw(): Deno.PointerValue {
        return this.#nativePtr;
    }

    slice(offset: number): IntPtr {
        if (this.#nativePtr === null) {
            return new DenoIntPtr(0n);
        }

        return new DenoIntPtr(Deno.UnsafePointer.offset(this.#nativePtr, offset));
    }

    toBuffer(offset?: number | undefined, length?: number | undefined): ArrayBuffer {
        if (this.#nativePtr === null) {
            throw new Error("Cannot convert null pointer to buffer.");
        }

        let l = length;
        if (this.#length !== undefined) {
            l = this.#length;
        }

        if (l === undefined) {
            throw new Error("Length must be specified when converting a pointer to a buffer for Deno.");
        }

        return Deno.UnsafePointerView.getArrayBuffer(this.#nativePtr, l, offset);
    }

    toCString(offset?: number): string {
        if (this.#nativePtr === null) {
            return "";
        }

        return Deno.UnsafePointerView.getCString(this.#nativePtr, offset);
    }

    toPwStr(offset?: number): string {
        if (this.#nativePtr === null) {
            return "";
        }

        const view = new Deno.UnsafePointerView(this.#nativePtr);

        let i = offset ?? 0;
        const codes: number[] = [];
        for (i;; i += 2) {
            const code = view.getUint16(i);
            if (code === 0) {
                break;
            }

            codes.push(code);
        }

        return new TextDecoder("utf-16le").decode(new Uint16Array(codes));
    }
}
