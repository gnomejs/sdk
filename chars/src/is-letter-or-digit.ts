import type { Char } from "./types.ts";
import { isLetter, isLetterUnsafe,} from "./is-letter.ts";
import { isDigit,  isDigitUnsafe } from "./is_digit.ts";


export function isLetterOrDigit(char: Char): boolean {
    return isLetter(char) || isDigit(char);
}

export function isLetterOrDigitUnsafe(char: Char): boolean {
    return isLetterUnsafe(char) || isDigitUnsafe(char);
}

export function isLetterOrDigitAt(str: string, index: number): boolean {
    const code = str.codePointAt(index) ?? 0;
    return isLetterOrDigitUnsafe(code);
}