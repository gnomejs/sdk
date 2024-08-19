import { simpleFold } from "@gnome/chars/simple-fold";
import { toCharSliceLike, type CharBuffer} from "./utils.ts";

export function lastIndexOfFold(value: CharBuffer, test: CharBuffer, index = 0): number {
   
    const s = toCharSliceLike(value);
    const t = toCharSliceLike(test);

    if (t.length > s.length) {
        return -1;
    }

    let f = 0;
    const l = Math.min(s.length, index === Infinity ? s.length : (index + 1));
    if (l - 1 < 0) {
        return -1;
    }

    for (let i = l - 1; i > -1; i--) {
        for (let j = t.length - 1; j > -1; j--) {
            let sr = s.at(i - f) ?? -1;
            let tr = t.at(j) ?? -1;

            if (sr === -1 || tr === -1) {
                break;
            }

            if (tr === sr) {
                f++;
                if (f === t.length) {
                    return i - t.length + 1;
                }

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
                    f++;
                    if (f === t.length) {
                        return i - t.length + 1;
                    }

                    continue;
                }

                f = 0;
                break;
            }

            let r = simpleFold(sr);
            while (r !== sr && r < tr) {
                r = simpleFold(r);
            }

            if (r === tr) {
                f++;

                if (f === t.length) {
                    return i - t.length + 1;
                }
                
                continue;
            }

            f = 0;
            break;
        }
        

        if (f === t.length) {
            return i - t.length + 1;
        }
    }

    return -1;
}

export function lastIndexOf(value: CharBuffer, test: CharBuffer, index = Infinity): number {
    const s = toCharSliceLike(value);
    const t = toCharSliceLike(test);

    if (t.length > s.length) {
        return -1;
    }

    const l = Math.min(s.length, index === Infinity ? s.length : (index + 1));
    if (l - 1 < 0) {
        return -1;
    }

    let f = 0;
    for (let i = l - 1; i > -1; i--) {
        for (let j = t.length - 1; j > -1; j--) {
            const sr = s.at(i - f) ?? -1;
            const tr = t.at(j) ?? -1;

            if (sr === -1 || tr === -1) {
                break;
            }

            if (tr === sr) {
                f++;
                if (f === t.length) {
                    return i - t.length + 1;
                }

                continue;
            }

            f = 0;
            break;
        }
        

        if (f === t.length) {
            return i - t.length + 1;
        }
    }

    return -1;
}