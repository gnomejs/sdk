export type TypedArray =
    | Uint8Array
    | Uint16Array
    | Uint32Array
    | Int8Array
    | Int16Array
    | Int32Array
    | Float32Array
    | Float64Array;

export interface Ptr {
    readonly isNull: boolean;

    valueOf(): number;

    toBigInt(): bigint;

    toPtr<T>(): T;
}

export enum FFITypes {
    i8 = 1,
    u8 = 2,
    i16 = 3,
    u16 = 4,
    i32 = 5,
    u32 = 6,
    i64 = 7,
    u64 = 8,
    f64 = 9,
    f32 = 10,
    bool = 11,
    ptr = 12,
    void = 13,
    function = 17,
    buffer = 99,
}

export interface FFIArgs {
    [FFITypes.i8]: number;
    [FFITypes.u8]: number;
    [FFITypes.i16]: number;
    [FFITypes.u16]: number;
    [FFITypes.i32]: number;
    [FFITypes.u32]: number;
    [FFITypes.i64]: bigint;
    [FFITypes.u64]: bigint;
    [FFITypes.f64]: number;
    [FFITypes.f32]: number;
    [FFITypes.bool]: boolean;
    [FFITypes.ptr]: Ptr | null;
    [FFITypes.function]: Ptr | null;
    [FFITypes.buffer]: TypedArray | null;
}

export interface FFIStrings {
    ["i8"]: FFITypes.i8;
    ["u8"]: FFITypes.u8;
    ["i16"]: FFITypes.i16;
    ["u16"]: FFITypes.u16;
    ["i32"]: FFITypes.i32;
    ["u32"]: FFITypes.u32;
    ["i64"]: FFITypes.i64;
    ["u64"]: FFITypes.u64;
    ["f64"]: FFITypes.f64;
    ["f32"]: FFITypes.f32;
    ["bool"]: FFITypes.bool;
    ["ptr"]: FFITypes.ptr;
    ["function"]: FFITypes.function;
    ["buffer"]: FFITypes.buffer;
}

export interface FFIReturn {
    [FFITypes.i8]: number;
    [FFITypes.u8]: number;
    [FFITypes.i16]: number;
    [FFITypes.u16]: number;
    [FFITypes.i32]: number;
    [FFITypes.u32]: number;
    [FFITypes.i64]: bigint;
    [FFITypes.u64]: bigint;
    [FFITypes.f64]: number;
    [FFITypes.f32]: number;
    [FFITypes.bool]: boolean;
    [FFITypes.ptr]: Ptr | null;
    [FFITypes.function]: Ptr | null;
    [FFITypes.buffer]: Ptr | null;
}

export type FFIKey = FFIArgs | keyof FFIStrings;
