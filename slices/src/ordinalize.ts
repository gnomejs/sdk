import { isSpace } from "@gnome/chars/is-space";
import { CharArrayBuilder } from "./char_array_builder.ts";
import { toCharSliceLike } from "./to_char_array.ts";
import type { CharSliceLike } from "./types.ts";

export function ordinalize(str: CharSliceLike | string): Uint32Array {
    if (typeof str === "string") {
       str = toCharSliceLike(str);
    }

    const sb = new CharArrayBuilder();
    const token = new CharArrayBuilder();
    for(let i = 0; i < str.length; i++) {
        const c = str.at(i) ?? -1;
        if (c === -1)
            continue;

        if (c >= 48 && c <= 57) {
            token.appendChar(c);

            continue;
        } else {
            if (token.length > 0) {
                if (isSpace(c)) {
                    const set = token.toArray();
                    const last = set[set.length - 1];
                    const last2 = set[set.length - 2];
                    let suffix = "th"
                    if (last2 === 49 && last > 48 && last < 52) {
                        suffix = "th";
                    } else {
                        if (last === 49) {
                            suffix = "st";
                        } else if (last === 50) {
                            suffix = "nd";
                        } else if (last === 51) {
                            suffix = "rd";
                        }
                    }

                    sb.appendCharArray(set);
                    sb.appendString(suffix);
                    sb.appendChar(c);
                    token.clear();
                    continue;
                } else {
                    sb.appendCharArray(token.toArray());
                    sb.appendChar(c);
                    token.clear();
                }
            } else {
                sb.appendChar(c);
            }
        }
    }

    const r = sb.toArray();
    sb.clear();
    return r;
}