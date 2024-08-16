import type { CharSliceLike } from "./types.ts";
import { isSpace } from "@gnome/chars/is-space";

export function trimEndSpace(s: CharSliceLike) : Uint32Array {
    let size = s.length;

    for(let i = s.length - 1; i >= 0; i--) {
        const c = s.at(i) ?? -1;
        if (isSpace(c)) {
            size--;
        } else {
            break;
        }
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

export function trimEndChar(s: CharSliceLike, c: number) {
    let size = s.length;

    for(let i = s.length - 1; i >= 0; i--) {
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

export function trimEndSlice(s: CharSliceLike, t: CharSliceLike) : Uint32Array {
    let size = s.length;

    for (let i = s.length - 1; i >= 0; i--) {
        let match = false;
        for(let j = 0; j < t.length; j++) {
            if (s.at(i) === t.at(j)) {
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
        buffer.set(s);
        return buffer;
    }

    for(let i = 0; i < size; i++) {
        buffer[i] = s.at(i) ?? 0;
    }

    return buffer;
}

export function trimEnd(s: CharSliceLike, t?: CharSliceLike) : Uint32Array {
    if (t === undefined) {
        return trimEndSpace(s);
    }

    if (t.length === 1) {
        return trimEndChar(s, t.at(0) ?? -1);
    }

    return trimEndSlice(s, t);
}