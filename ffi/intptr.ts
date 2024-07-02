/**
 * Represents a platform-specific integer pointer.
 */
export abstract class IntPtr {
    abstract value: number;

    abstract nativePtr: unknown;

    /**
     * Checks if the integer pointer is null.
     * @returns `true` if the integer pointer is null, `false` otherwise.
     */
    get isNull(): boolean {
        return this.value === 0;
    }

    /**
     * Converts the integer pointer to a primitive number.
     * @returns The value of the integer pointer.
     */
    [Symbol.toPrimitive](): number {
        return this.value;
    }

    /**
     * Returns the value of the integer pointer.
     * @returns The value of the integer pointer.
     */
    valueOf(): number {
        return this.value;
    }

    /**
     * Converts the integer pointer to a native pointer of type `T`.
     * @returns The native pointer of type `T`.
     * @template T - The type of the native pointer.
     */
    toNativePtr<T>(): T {
        return this.nativePtr as T;
    }

    /**
     * Converts the integer pointer to a C-style string.
     * @param offset - The offset from the start of the pointer.
     * @returns The C-style string representation of the integer pointer.
     */
    abstract toCString(offset?: number): string;

    /**
     * Converts the integer pointer to a wide string for windows.
     * @param offset - The offset from the start of the pointer.
     * @returns The wide string representation of the integer pointer.
     */
    abstract toPwStr(offset?: number): string;

    /**
     * Converts the integer pointer to a buffer.
     * @param offset - The offset from the start of the pointer.
     * @param length - The length of the buffer.
     * @returns The buffer representation of the integer pointer.
     */
    abstract toBuffer(offset?: number, length?: number): ArrayBuffer;
}
