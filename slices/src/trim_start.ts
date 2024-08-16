import type { CharSliceLike } from "./types.ts";
import { isSpace } from "@gnome/chars/is-space";


export function trimStartSpace(s: CharSliceLike) : Uint32Array {
    let size = s.length;

    for(let i = 0; i < s.length; i++) {
        if (isSpace(s.at(i) ?? -1)) {
            size--;
        } else {
            break;
        }
    }

    if (size === s.length && s instanceof Uint32Array) {
        return s;
    }

    const buffer = new Uint32Array(size);
    if (s instanceof Uint32Array) {
        buffer.set(s);
        return buffer;
    }

    for(let i = 0; i < size; i++) {
        buffer[i] = s.at(i) ?? 0;
    }

    return buffer;
}

export function trimStartChar(s: CharSliceLike, c: number) {
    if (!Number.isInteger(c) || c < 0 || c > 0x10FFFF)
        throw new RangeError("Invalid code point");

    let size = s.length;

    for(let i = 0; i < s.length; i++) {
        if (s.at(i) === c) {
            size--;
        } else {
            break;
        }
    }

    if (size === s.length && s instanceof Uint32Array) {
        return s;
    }

    const buffer = new Uint32Array(size);
    if (s instanceof Uint32Array) {
        buffer.set(s);
        return buffer;
    }

    for(let i = 0; i < size; i++) {
        buffer[i] = s.at(i) ?? 0;
    }

    return buffer;
}

export function trimStartSlice(s: CharSliceLike, t: CharSliceLike) {
    let size = s.length;
    let j = 0;
    
    for (j = 0; j < s.length; j++) {
        let match = false;
        const c = s.at(j) ?? -1;
        for(let i = 0; i < t.length; i++) {
            if (c === t.at(i)) {
                size--;
                match = true;
                break;
            }
        }

        if (!match) {
            break;
        }
    }

    if (size === s.length && s instanceof Uint32Array) {
        return s;
    }

    const buffer = new Uint32Array(size);
    if (s instanceof Uint32Array) {
        buffer.set(s.slice(j));
        return buffer;
    }

    for(let i = 0; i < size; i++) {
        buffer[i] = s.at(i + j) ?? 0;
    }

    return buffer;
}

export function trimStart(s: CharSliceLike, t?: CharSliceLike) : Uint32Array {
    if (t === undefined) {
        return trimStartSpace(s);
    }

    if (t.length === 1) {
        trimStartChar(s, t.at(0) ?? -1);
    }

    return trimStartSlice(s, t);
}