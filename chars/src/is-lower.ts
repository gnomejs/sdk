import type { Char } from "./types.ts";
import { latin1, is16, is32, pLl } from "./tables/latin1.ts";
import { Ll } from "./tables/ll.ts";

export function isLower(char: Char) : boolean {
    if (Number.isInteger(char) === false || char < 0 || char > 0x10FFFF)
        return false;

    if (char < 256) 
        return (latin1[char] & pLl) !== 0;

    const hi = Ll.R16[Ll.R32.length - 1][1];
    if (char  <= hi) {
       return is16(Ll.R16, char);
    }

    const lo = Ll.R32[0][0];
    if (char >= lo) {
       return is32(Ll.R32, char);
    }

    return false;
}

export function isLowerUnsafe(char: Char) : boolean {
    if (char < 256) 
        return (latin1[char] & pLl) !== 0;

    const hi = Ll.R16[Ll.R32.length - 1][1];
    if (char  <= hi) {
       return is16(Ll.R16, char);
    }

    const lo = Ll.R32[0][0];
    if (char >= lo) {
       return is32(Ll.R32, char);
    }

    return false;
}

export function isLowerAt(str: string, index: number) : boolean {
    const code = str.codePointAt(index) ?? 0;
    return isLowerUnsafe(code);
}