import { camelize as og } from "@gnome/slices/camelize";

export function camelize(value: string): string {
    const r = og(value);
    return String.fromCodePoint(...r);
}
