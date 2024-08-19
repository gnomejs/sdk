import { CharArrayBuilder } from "./char_array_builder.ts";
import { CHAR_HYPHEN_MINUS, CHAR_UNDERSCORE } from "@gnome/chars/constants";
import { isDigit, isLetter, isLower, isSpace, isUpper, toLower, toUpper } from "@gnome/chars";
import { type CharBuffer, toCharSliceLike } from "./utils.ts";

interface DasherizeOptions {
    screaming?: boolean;
    preserveCase?: boolean;
}

/**
 * Dasherize converts a string to dasherized case, converting any `_`, `-`, or ` ` characters]
 * to `-` and converting the string to lowercase unless the preserveCase option is set to true.
 * @param value The string to convert to dasherized case.
 * @param options The options for the function.
 * @returns The dasherized string as a Uint32Array.
 */
export function dasherize(value: CharBuffer, options?: DasherizeOptions): Uint32Array {
    const v = toCharSliceLike(value);

    const sb = new CharArrayBuilder();
    let last = 0;
    options ??= {};
    for (let i = 0; i < value.length; i++) {
        const c = v.at(i) ?? -1;
        if (c === -1) {
            continue;
        }

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
            last = CHAR_HYPHEN_MINUS;
            continue;
        }
    }
    const r = sb.toArray();
    sb.clear();
    return r;
}
