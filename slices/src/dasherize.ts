import { CharArrayBuilder } from "./char_array_builder.ts";
import { CHAR_UNDERSCORE, CHAR_HYPHEN_MINUS } from "@gnome/chars/constants";
import { isLetter, isLower, isUpper, toLower, isDigit, toUpper, isSpace } from "@gnome/chars";
import type { CharSlice } from "./char_slice.ts";

interface DasherizeOptions {
    screaming?: boolean;
    preserveCase?: boolean;
}

export function dasherize(str: CharSlice, options?: DasherizeOptions): Uint32Array {
    const sb = new CharArrayBuilder();
    let last = 0;
    options ??= {};
    for(let i = 0; i < str.length; i++) {
        const c = str.at(i) ?? -1;
        if (c === -1)
            continue;

        if (isLetter(c)) {
            if (isUpper(c)) {
                if (isLetter(last) && isLower(last)) {
                    sb.appendChar(CHAR_HYPHEN_MINUS);
                
                    if (options.preserveCase || options.screaming) {
                        sb.appendChar(c);
                        last = c;
                        continue;
                    }

                    sb.appendChar(toLower(c));
                    last = c;
                    continue;
                }

                if (options.preserveCase || options.screaming) {
                    sb.appendChar(c);
                    last = c;
                    continue;
                }

                sb.appendChar(toLower(c));
                last = c;
                continue;
            }

            if (options.screaming) {
                sb.appendChar(toUpper(c));
            } else if (options.preserveCase) {
                sb.appendChar(c);
            } else {
                sb.appendChar(toLower(c));
            }

            last = c;
            continue;
        }

        if (isDigit(c)) {
            last = c;
            sb.appendChar(c);
        }

        if (c === CHAR_UNDERSCORE || c === CHAR_HYPHEN_MINUS || isSpace(c)) {
            if (sb.length === 0) {
                continue;
            }

            if (last === CHAR_HYPHEN_MINUS) {
                continue;
            }

            sb.appendChar(CHAR_HYPHEN_MINUS);
            last = CHAR_HYPHEN_MINUS
            continue;
        }
    }
    const r = sb.toArray();
    sb.clear();
    return r;
}
