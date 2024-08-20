export interface CharSliceLike {
    at(index: number): number | undefined;
    length: number;
}

export interface CharSequence extends CharSliceLike {
    slice(start: number, end?: number): CharSequence;
}

export type CharBuffer = string | Uint32Array | Uint16Array | Uint8Array | CharSequence;

export function toCharArray(s: string): Uint32Array {
    const set = new Uint32Array(s.length);
    for (let i = 0; i < s.length; i++) {
        set[i] = s.codePointAt(i) ?? 0;
    }

    return set;
}

export function toString(buffer: CharBuffer): string {
    if (typeof buffer === "string") {
        return buffer;
    }

    if (buffer instanceof Uint32Array) {
        return String.fromCodePoint(...buffer);
    }

    if (buffer instanceof Uint16Array) {
        const codePoints = new Uint32Array(buffer.buffer);
        return String.fromCodePoint(...codePoints);
    }

    if (buffer instanceof Uint8Array) {
        const codePoints = new Uint32Array(buffer.buffer);
        return String.fromCodePoint(...codePoints);
    }

    const codePoints = new Uint32Array(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
        codePoints[i] = buffer.at(i) ?? 0;
    }

    return String.fromCodePoint(...codePoints);
}

export function toCharSliceLike(s: CharBuffer): CharSliceLike {
    if (typeof s === "string") {
        return {
            at(i: number): number | undefined {
                return s.codePointAt(i);
            },
            length: s.length,
        };
    }

    if (s instanceof Uint32Array) {
        return s;
    }

    if (s instanceof Uint16Array) {
        return new Uint32Array(s.buffer);
    }

    if (s instanceof Uint8Array) {
        return new Uint32Array(s.buffer);
    }

    return s;
}
