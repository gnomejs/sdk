import type { Char } from "./types.ts";
import { latin1, pP, is16, is32 } from "./tables/latin1.ts";
import { P } from "./tables/p.ts";


/**
 * Checks if the given character is a punctuation character.
 *
 * @param char - The character to check.
 * @returns `true` if the character is a punctuation character, `false` otherwise.
 */
export function isPunc(char: Char) : boolean {
    if (Number.isInteger(char) === false || char < 0 || char > 255)
        return false;

    if (char < 256) 
        return (latin1[char] & pP) !== 0;

    const hi = P.R16[P.R32.length - 1][1];
    if (char  <= hi) {
       return is16(P.R16, char);
    }

    const lo = P.R32[0][0];
    if (char >= lo) {
       return is32(P.R32, char);
    }

    return false;
}


export function isPuncUnsafe(char: Char) : boolean {
    if (char < 256) 
        return (latin1[char] & pP) !== 0;

    const hi = P.R16[P.R32.length - 1][1];
    if (char  <= hi) {
       return is16(P.R16, char);
    }

    const lo = P.R32[0][0];
    if (char >= lo) {
       return is32(P.R32, char);
    }

    return false;
}


export function isPuncAt(str: string, index: number) : boolean {
    const code = str.codePointAt(index) ?? 0;
    return isPunc(code);
}