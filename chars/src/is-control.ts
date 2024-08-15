import { latin1, pC } from "./tables/latin1.ts";
import type { Char } from "./types.ts";

export function IsControl(char: Char): boolean {
    if (Number.isInteger(char) === false || char <0 || char > 255)
        return false;

    return (latin1[char] & pC) !== 0;
}

export function IsControlFast(char: Char): boolean {
    return (latin1[char] & pC) !== 0;
}

export function IsControlAt(str: string, index: number): boolean {
    const code = str.codePointAt(index) ?? 0;
    return (latin1[code] & pC) !== 0;
}