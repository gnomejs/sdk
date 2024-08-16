import type { CharSliceLike } from "./types.ts";
import { isSpace } from "@gnome/chars/is-space";


export function trimSpace(s: CharSliceLike) : Uint32Array {
    let start = 0;
    let end = s.length;

    for(let i = 0; i < s.length; i++) {
        if (isSpace(s.at(i) ?? -1)) {
            start++;
        } else {
            break;
        }
    }

    if (start === s.length) {
        return new Uint32Array(0);
    }

    for(let i = s.length - 1; i >= 0; i--) {
        if (isSpace(s.at(i) ?? -1)) {
            end--;
        } else {
            break;
        }
    }

    if (start === 0 && end === s.length && s instanceof Uint32Array) {
        return s;
    }

    const buffer = new Uint32Array(end - start);
    if (s instanceof Uint32Array) {
        buffer.set(s.subarray(start, end));
        return buffer;
    }

    for(let i = start; i < end; i++) {
        buffer[i - start] = s.at(i) ?? 0;
    }

    return buffer;
}

export function trimChar(s: CharSliceLike, c: number) {
    if (!Number.isInteger(c) || c < 0 || c > 0x10FFFF)
        throw new RangeError("Invalid code point");

    let start = 0;
    let end = s.length;

    for(let i = 0; i < s.length; i++) {
        if (s.at(i) === c) {
            start++;
        } else {
            break;
        }
    }

    if (start === s.length) {
        return new Uint32Array(0);
    }

    for(let i = s.length - 1; i >= 0; i--) {
        if (s.at(i) === c) {
            end--;
        } else {
            break;
        }
    }

    if (start === 0 && end === s.length && s instanceof Uint32Array) {
        return s;
    }

    const buffer = new Uint32Array(end - start);
    if (s instanceof Uint32Array) {
        buffer.set(s.subarray(start, end));
        return buffer;
    }

    for(let i = start; i < end; i++) {
        buffer[i - start] = s.at(i) ?? 0;
    }

    return buffer;
}

export function trimSlice(s: CharSliceLike, t: CharSliceLike) {
    let start = 0;
    let end = s.length;

    for(let i = 0; i < s.length; i++) {
        let match = false;
        for(let j = 0; j < t.length; j++) {
            if (s.at(i) === t.at(j)) {
                start++;
                match = true;
                break;
            }
        }

        if (!match) {
            break;
        }
    }

    if (start === s.length) {
        return new Uint32Array(0);
    }

    for(let i = s.length - 1; i >= 0; i--) {
        let match = false;
        for(let j = 0; j < t.length; j++) {
            if (s.at(i) === t.at(j)) {
                end--;
                match = true;
                break;
            }
        }

        if (!match) {
            break;
        }
    }

    if (start === 0 && end === s.length && s instanceof Uint32Array) {
        return s;
    }

    const buffer = new Uint32Array(end - start);
    if (s instanceof Uint32Array) {
        buffer.set(s.subarray(start, end));
        return buffer;
    }

    for(let i = start; i < end; i++) {
        buffer[i - start] = s.at(i) ?? 0;
    }

    return buffer;
}

export function trim(s: CharSliceLike, t?: CharSliceLike) {
    if (t === undefined) {
        return trimSpace(s);
    }

    if (t.length === 1) {
        return trimChar(s, t.at(0) ?? 0);
    }

    return trimSlice(s, t);
}