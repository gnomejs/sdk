import type { Char } from "./types.ts";
import { latin1, pS, is16, is32 } from "./tables/latin1.ts";
import { S } from "./tables/s.ts";


export function IsSymbol(char: Char) : boolean {
    if (Number.isInteger(char) === false || char < 0 || char > 255)
        return false;

    if (char < 256) 
        return (latin1[char] & pS) !== 0;

    const hi = S.R16[S.R32.length - 1][1];
    if (char  <= hi) {
       return is16(S.R16, char);
    }

    const lo = S.R32[0][0];
    if (char >= lo) {
       return is32(S.R32, char);
    }

    return false;
}

export function IsSymbolUnsafe(char: Char) : boolean {
    if (char < 256) 
        return (latin1[char] & pS) !== 0;

    const hi = S.R16[S.R32.length - 1][1];
    if (char  <= hi) {
       return is16(S.R16, char);
    }

    const lo = S.R32[0][0];
    if (char >= lo) {
       return is32(S.R32, char);
    }

    return false;
}


export function IsSymbolAt(str: string, index: number) : boolean {
    const code = str.codePointAt(index) ?? 0;
    return IsSymbol(code);
}