import type { CharSliceLike } from "./types.ts";

export function toCharArray(s: string): Uint32Array {
    const set = new Uint32Array(s.length);
    for (let i = 0; i < s.length; i++) {
        set[i] = s.codePointAt(i) ?? 0;
    }

    return set;
}

export function toCharSliceLike(s: string): CharSliceLike {
    return {
        at(i: number): number | undefined {
            return s.codePointAt(i);
        },
        length: s.length,
    };
}
