import { titleize as og } from "@gnome/slices/titleize"


export function titleize(s: string) : string {
     const r = og(s);

     return String.fromCodePoint(...r);
}