import { isSpaceAt } from "@gnome/chars/is-space";

export function isNull(s: string | null): s is null{
    return s === null;
}

export function isUndefined(s: string | undefined): s is undefined {
    return s === undefined;
}

export function isEmpty(s: string): s is "" {
    return s.length === 0;
}

export function isNullOrEmpty(s: string | null): s is null {
    return s === null || s.length === 0;
}


export function isNullOrWhiteSpace(s: string | null): s is null {
    if (s === null || s.length === 0) {
        return true;
    }

    for (let i = 0; i < s.length; i++) {
        if (!isSpaceAt(s, i)) {
            return false;
        }
    }

    return true;
}
