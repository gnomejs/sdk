import { equalFold as og } from "@gnome/slices/equal-fold"
import { toCharSliceLike  } from "@gnome/slices/to-char-array";

/**
 * equalFold reports whether s and t, interpreted as UTF-8 strings, are equal under Unicode case-folding.
 * 
 * @param s 
 * @param t 
 */
export function equalFold(s: string, t: string): boolean {
    if (s === t)
        return true;

    if (s.length !== t.length) 
        return false;
    
    return og(toCharSliceLike(s), toCharSliceLike(t));
}