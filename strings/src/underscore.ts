import { underscore as og } from "@gnome/slices/underscore";

export function underscore(s: string) {
    const r = og(s);
    return String.fromCodePoint(...r);
}
