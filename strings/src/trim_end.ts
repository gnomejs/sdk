import { trimEndChar as ogChar, trimEndSlice as ogSlice } from "@gnome/slices/trim-end";
import { toCharSliceLike } from "@gnome/slices/to-char-array";
import type { CharSliceLike } from "@gnome/slices/types";

export function trimEndChar(s: string, c: number): string {
    const r = ogChar(toCharSliceLike(s), c);
    return String.fromCodePoint(...r);
}

export function trimEndSlice(s: string, t: string | CharSliceLike): string {
    if (typeof t === "string") {
        t = toCharSliceLike(t);
    }

    const r = ogSlice(toCharSliceLike(s), t);
    return String.fromCodePoint(...r);
}

export function trimEnd(s: string, t?: string | CharSliceLike): string {
    if (t === undefined) {
        return s.trimEnd();
    }

    if (t.length === 1) {
        if (typeof t === "string") {
            t = toCharSliceLike(t);
        }

        return trimEndChar(s, t.at(0) ?? -1);
    }

    return trimEndSlice(s, t);
}
