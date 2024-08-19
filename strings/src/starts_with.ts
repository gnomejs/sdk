import { startsWithFold as ogFold, startsWith as og } from "@gnome/slices/starts-with";
import type { CharBuffer } from "@gnome/slices/utils";

export function startsWith(value: string, prefix: CharBuffer) : boolean {
    return og(value, prefix);
}

export function startsWithFold(value: string, prefix: CharBuffer) : boolean {
    return ogFold(value, prefix);
}
