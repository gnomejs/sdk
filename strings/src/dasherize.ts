import { dasherize as og } from "@gnome/slices/dasherize";

export function dasherize(s: string): string {
    const r = og(s);
    return String.fromCodePoint(...r);
}
