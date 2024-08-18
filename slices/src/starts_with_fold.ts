import { simpleFold } from "@gnome/chars/simple-fold";
import type { CharSliceLike } from "./types.ts";

export function startsWithFold(s: CharSliceLike, t: CharSliceLike) : boolean {
    if (s === t) {
        return true;
    }

    if (t.length > s.length) {
        return false;
    }

    let i = 0;

    for (; i < t.length; i++) {
        let sr = s.at(i) ?? -1;
        let tr = t.at(i) ?? -1;
        if (sr === -1 || tr === -1) {
            return false;
        }

        if ((sr | tr) >= 0x80) {
            {
                let j = i;

                for (; j < t.length; j++) {
                    let sr = s.at(j) ?? -1;
                    let tr = t.at(j) ?? -1;
                    if (sr === -1 || tr === -1) {
                        return false;
                    }

                    if (tr === sr) {
                        continue;
                    }

                    if (tr < sr) {
                        const tmp = tr;
                        tr = sr;
                        sr = tmp;
                    }

                    // short circuit if tr is ASCII
                    if (tr < 0x80) {
                        if (65 <= sr && sr <= 90 && tr === sr + 32) {
                            continue;
                        }

                        return false;
                    }

                    let r = simpleFold(sr);
                    while (r !== sr && r < tr) {
                        r = simpleFold(r);
                    }

                    if (r === tr) {
                        continue;
                    }

                    return false;
                }

                return true;
            }
        }

        if (tr === sr) {
            continue;
        }

        if (tr < sr) {
            const tmp = tr;
            tr = sr;
            sr = tmp;
        }

        if (65 <= sr && sr <= 90 && tr === sr + 32) {
            continue;
        }

        return false;
    }

    return true;
}
