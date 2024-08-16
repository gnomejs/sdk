import type { CharSliceLike } from "./types.ts";
import { toUpper } from "@gnome/chars/to-upper"

export function capitalize(s: CharSliceLike) : Uint32Array {
    const buffer = new Uint32Array(s.length);
    if (s instanceof Uint32Array) {
        buffer.set(s);
        buffer[0] = toUpper(buffer[0]);
        return buffer;
    }

    for(let i = 0; i < s.length; i++) {
        const r = s.at(i);
        if (r === undefined) {
            buffer[i] = 0;
            continue;
        }
        if (i === 0) {
            buffer[i] = toUpper(r);
            continue;
        }

        buffer[i] = r
    }

    return buffer;
}