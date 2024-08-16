import { isSpaceAt } from "@gnome/chars/is-space";

export function isNotNull(s : string | null | undefined) : s is string {
    return s !== null && s !== undefined;
}

export function isNotNullOrEmpty(s : string | null | undefined) : s is string {
    return s !== null && s !== undefined && s.length > 0;
}

export function isNotNullOrSpace(s : string | null | undefined) : s is string {
    if (s === null || s === undefined || s.length === 0) {
        return false;
    }

    for (let i = 0; i < s.length; i++) {
        if (!isSpaceAt(s, i)) {
            return true;
        }
    }

    return false;
}