import { CHAR_SPACE, CHAR_UNDERSCORE } from "@gnome/chars/constants";
import { isLetter, isLetterOrDigit, isLower, isSpace, isUpper, toLower, toUpper } from "@gnome/chars";
import { CharArrayBuilder } from "./char_array_builder.ts";
import { equalFold } from "./equal_fold.ts";
import { Tokens } from "./tokens.ts";
import type { CharSliceLike } from "./types.ts";
import { toCharSliceLike } from "./to_char_array.ts";

/**
 * @description This is a list of words that should not be capitalized for title case.
 */
export const NoCapitalizeWords : Tokens = new Tokens();
[
    "and",
    "or",
    "nor",
    "a",
    "an",
    "the",
    "so",
    "but",
    "to",
    "of",
    "at",
    "by",
    "from",
    "into",
    "on",
    "onto",
    "off",
    "out",
    "in",
    "over",
    "with",
    "for",
].forEach((o) => NoCapitalizeWords.addString(o));

export function titleize(s: CharSliceLike | string): Uint32Array {
    if (typeof s === "string") {
        s = toCharSliceLike(s);
    }

    const sb = new CharArrayBuilder();
    let last = 0;
    const tokens = new Array<Uint32Array>();

    for (let i = 0; i < s.length; i++) {
        const c = s.at(i) ?? -1;
        if (c === -1) {
            continue;
        }

        if (isLetterOrDigit(c)) {
            if (isUpper(c)) {
                if (isLetter(last) && isLower(last)) {
                    tokens.push(sb.toArray());
                    sb.clear();

                    sb.appendChar(c);
                    last = c;
                    continue;
                }
            }

            sb.appendChar(toLower(c));
            last = c;
            continue;
        }

        if (c === CHAR_UNDERSCORE || isSpace(c)) {
            if (sb.length === 0) {
                continue;
            }

            if (last === CHAR_UNDERSCORE) {
                continue;
            }

            tokens.push(sb.toArray());
            sb.clear();

            last = c;
            continue;
        }
    }

    if (sb.length > 0) {
        tokens.push(sb.toArray());
        sb.clear();
    }

    for (const token of tokens) {
        let skip = false;
        for (const title of NoCapitalizeWords) {
            if (equalFold(title, token)) {
                if (sb.length > 0) {
                    sb.appendChar(CHAR_SPACE);
                }

                sb.appendCharArray(title); // already lower case.
                skip = true;
                break;
            }
        }

        if (skip) {
            continue;
        }

        const first = toUpper(token[0]);
        token[0] = first;

        if (sb.length > 0) {
            sb.appendChar(CHAR_SPACE);
        }

        sb.appendCharArray(token);
    }

    const v = sb.toArray();
    sb.clear();
    return v;
}
