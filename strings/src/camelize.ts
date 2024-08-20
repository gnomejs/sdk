import { camelize as og, type CamelizeOptions } from "@gnome/slices/camelize";

export function camelize(value: string, options?: CamelizeOptions): string {
    const r = og(value, options);
    return String.fromCodePoint(...r);
}
