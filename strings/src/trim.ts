import { trimChar as ogChar, trimSlice as ogSlice } from "@gnome/slices/trim"
import { toCharSliceLike } from "@gnome/slices/to-char-array";
import type { CharSliceLike } from "@gnome/slices/types";

export function trimChar(s: string, c: number) : string {
    const r = ogChar(toCharSliceLike(s), c);
    return String.fromCodePoint(...r);
}

export function trimSlice(s: string, t: string | CharSliceLike) : string {
    if (typeof t === "string") {
        t = toCharSliceLike(t);
    }

    const r = ogSlice(toCharSliceLike(s), t);
    return String.fromCodePoint(...r);
}

export function trim(s: string, t?: string | CharSliceLike) : string {
    if (t === undefined)
        return s.trim();

    if (t.length === 1) {
        if (typeof t === "string") {
            t = toCharSliceLike(t);
        }

        return trimChar(s, t.at(0) ?? -1);
    }

    return trimSlice(s, t);
}
