import { CharArrayBuilder } from "./char_array_builder.ts";
import { CHAR_UNDERSCORE, CHAR_HYPHEN_MINUS } from "@gnome/chars/constants";
import { isLetter, isDigit, toUpper, isSpace, toLower } from "@gnome/chars";
import type { CharSliceLike } from "./types.ts";
import { toCharSliceLike } from "./to_char_array.ts";

export function camelize(str: CharSliceLike | string)  : Uint32Array{
    if (typeof str === "string") {
        str = toCharSliceLike(str);
    }
    
    const sb = new CharArrayBuilder();

    let last = 0;
    for(let i = 0; i < str.length; i++) {
        const c = str.at(i) ?? -1;
        if (c === -1)
            continue;

        if (i === 0 && isLetter(c)) {
            sb.appendChar(toUpper(c));
            last = c;
            continue;
        }

        if (isLetter(c)) {
            if (last === CHAR_UNDERSCORE) {
                sb.appendChar(toUpper(c));
                last = c;
                continue;
            }

            sb.appendChar(toLower(c));
            last = c;
            continue;
        }

        if (c === CHAR_HYPHEN_MINUS || c === CHAR_UNDERSCORE || isSpace(c)) {
            last = CHAR_UNDERSCORE;
            continue;
        }

        if (isDigit(c)) {
            last = c;
            sb.appendChar(c);
            continue;
        }

        sb.appendChar(c);
        last = c;
    }

    const r = sb.toArray();
    sb.clear();
    return r;
}