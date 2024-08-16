import { trimStartChar as ogChar, trimStartSlice as ogSlice } from "@gnome/slices/trim-start"
import { toCharSliceLike } from "@gnome/slices/to-char-array";
import type { CharSliceLike } from "@gnome/slices/types";


export function trimStartChar(s: string, c: number) : string {
    const r = ogChar(toCharSliceLike(s), c);
    return String.fromCodePoint(...r);
}

export function trimStartSlice(s: string, t: string | CharSliceLike) : string {
    if (typeof t === "string") {
        t = toCharSliceLike(t);
    }

    const r = ogSlice(toCharSliceLike(s), t);
    return String.fromCodePoint(...r);
}

export function trimStart(s: string, t?: string | CharSliceLike) : string {
    if (t === undefined)
        return s.trimStart();

    if (t.length === 1) {
        if (typeof t === "string") {
            t = toCharSliceLike(t);
        }

        return trimStartChar(s, t.at(0) ?? -1);
    }

    return trimStartSlice(s, t);
}
