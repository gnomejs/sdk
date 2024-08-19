import { endsWithFold as ogFold, endsWith as og } from "@gnome/slices/ends-with";
import type { CharBuffer } from "@gnome/slices/utils";

export function endsWithFold(value: string, suffix: CharBuffer) : boolean {
    if (suffix.length > value.length) {
        return false;
    }

    return ogFold(value, suffix);
}

export function endsWith(value: string, suffix: CharBuffer) : boolean {
    if (suffix.length > value.length) {
        return false;
    }

    return og(value, suffix);
}