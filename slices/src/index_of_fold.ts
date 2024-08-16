

import { simpleFold } from "@gnome/chars/simple-fold"
import type { CharSliceLike } from "./types.ts";

export function indexOfFold(s: CharSliceLike, t: CharSliceLike, index = 0) : number {
    if (s === t)
        return 0

    if (t.length > s.length) 
        return -1;
    
    let f = 0;
    let i = index;
    for(; i < s.length; i++) {
        let sr = s.at(i) ?? -1;
        let tr = t.at(f) ?? -1;
       
        if (sr === -1 || tr === -1) 
        {
            f = 0;
            continue;
        }
        
        if ((sr | tr) >= 0x80) {
            {
               
                let j = i;
               
                for(; j < s.length; j++) {
                    let sr = s.at(j) ?? -1;
                    let tr = t.at(f) ?? -1;
                    if (sr === -1 || tr === -1)
                    {
                        console.log(i, "reset")
                        f = 0;
                        continue;
                    }
                    
                    if (tr < sr) {
                        const tmp = tr;
                        tr = sr;
                        sr = tmp; 
                    }

                    // short circuit if tr is ASCII
                    if (tr < 0x80) {
                        if (65 <= sr && sr <= 90 && tr == sr+97-65)  {
                            f++;

                            if (f == t.length - 1) 
                                return i + 1 - f;
                            continue;
                        }
                        
                        f = 0;
                        continue;
                    }

                    let r = simpleFold(sr);
                    while(r != sr && r < tr) {
                        r = simpleFold(r);
                    }

                    if (r == tr){
                        f++;

                        if (f == t.length - 1) 
                            return i + 1 - f;
                        continue;
                    }
                    
                    f = 0;
                }

                if (f == t.length - 1) 
                    return i + 1 - f;

                return -1;
            }
        }

        if (tr === sr) {
            console.log("match", i, f)
            f++;

            if (f === t.length - 1)  {
                return i + 1 - f;
            }
                
            continue;
        }

         
        if (tr < sr) {
            const tmp = tr;
            tr = sr;
            sr = tmp; 
        }

        if (65 <= sr && sr <= 90 && tr == sr+32)  {
            f++;
            
            if (f === t.length - 1) {
                return i + 1 - f;
            }

            continue;
        }
          
        f = 0;
    }

    if (f == t.length) 
        return i - f;

    return -1;
}