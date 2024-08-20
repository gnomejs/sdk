import { capitalize as og } from "@gnome/slices/capitalize";

export function capitalize(value: string): string {
    const r = og(value);
    return String.fromCodePoint(...r);
}
