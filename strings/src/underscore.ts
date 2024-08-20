import { underscore as og, type UnderScoreOptions } from "@gnome/slices/underscore";

export function underscore(value: string, options?: UnderScoreOptions): string {
    const r = og(value, options);
    return String.fromCodePoint(...r);
}
