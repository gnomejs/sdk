import { indexOf as og, indexOfFold as ogFold } from "@gnome/slices/index-of";
import type { CharBuffer } from "@gnome/slices/utils";

export function indexOfFold(value: string, chars: CharBuffer, index = 0): number {
    return ogFold(value, chars, index);
}

export function indexOf(value: string, chars: CharBuffer, index = 0): number {
    return og(value, chars, index);
}
