import { endsWithFold as og } from "@gnome/slices/ends-with-fold"
import { toCharSliceLike } from "@gnome/slices/to-char-array";

export function endsWithFold(s: string, t: string) {
    if (s === t)
        return true;

    if (t.length > s.length) 
        return false;
    
    return og(toCharSliceLike(s), toCharSliceLike(t));
}