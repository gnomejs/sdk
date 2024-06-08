import { expandGlob } from "../expand-glob.ts";

const glob = new URL("*", import.meta.url).pathname;
for await (const { filename } of expandGlob(glob)) {
    console.log(filename);
}
