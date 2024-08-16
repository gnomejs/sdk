import type { CharSliceLike } from "./types.ts";
import { simpleFold } from "@gnome/chars/simple-fold";

export function endsWithFold(s: CharSliceLike, t: CharSliceLike) {
    if (s === t)
        return true;

    if (t.length > s.length) 
        return false;
    
    let i = Math.min(s.length, t.length);
    for (i; i > 0; i--) {
        let sr = s.at(s.length -i) ?? -1;
        let tr = t.at(t.length -i) ?? -1;
        if (sr === -1 || tr === -1) 
            return false;
        
        if ((sr | tr) >= 0x80) {
            {
                let j = i;
               
                for(; j > 0; j--) {
                    let sr = s.at(s.length - j) ?? -1;
                    let tr = t.at(t.length - j) ?? -1;
                    if (sr === -1 || tr === -1) return false;
                    
                    if (tr < sr) {
                        const tmp = tr;
                        tr = sr;
                        sr = tmp; 
                    }

                    // short circuit if tr is ASCII
                    if (tr < 0x80) {
                        if (65 <= sr && sr <= 90 && tr == sr+97-65) 
                            continue;

                        return false
                    }

                    let r = simpleFold(sr);
                    while(r != sr && r < tr) {
                        r = simpleFold(r);
                    }

                    if (r == tr) 
                        continue;

                    return false;
                }

                return true;
            }
        }

        if (tr === sr) 
            continue;

         
        if (tr < sr) {
            const tmp = tr;
            tr = sr;
            sr = tmp; 
        }

        if (65 <= sr && sr <= 90 && tr == sr+32) 
            continue 

        return false
    }

    return true;
}
