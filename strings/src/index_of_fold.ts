import { indexOfFold as og } from "@gnome/slices/index-of-fold";
import { toCharSliceLike } from "@gnome/slices/to-char-array";

export function indexOfFold(s: string, t: string, index = 0): number {
    if (s === t) {
        return 0;
    }

    if (t.length > s.length) {
        return -1;
    }

    return og(toCharSliceLike(s), toCharSliceLike(t), index);
}
