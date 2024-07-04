import { dirname, fromFileUrl, join } from "@std/path";
import { isFile, walk } from "@gnome/fs";

const __dirname = dirname(fromFileUrl(import.meta.url));

const rwd = dirname(__dirname);
console.log(rwd);

for await (const entry of walk(rwd)) {
    if (entry.isDirectory) {
        const mod = join(entry.path, "mod.ts");
        const readme = join(entry.path, "README.md");

        if (await isFile(mod) && await isFile(readme)) {
            const readmeContent = await Deno.readTextFile(readme);
            const modContent = await Deno.readTextFile(mod);

            const overviewIndex = readmeContent.indexOf("## Overview");
            const modCommentEndIndex = modContent.indexOf("*/");
            if (readmeContent.indexOf("## Overview") > -1) {
                if (modCommentEndIndex > -1) {
                    const modContentWithoutComment = modContent.slice(modCommentEndIndex + 2);
                    const newModContent = `/**
 * ${readmeContent.slice(overviewIndex).replaceAll("\n", "\n * ")}
 */`;

                    await Deno.writeTextFile(mod, newModContent + modContentWithoutComment);
                } else {
                    const newModContent = `/**
 * ${readmeContent.slice(overviewIndex).replaceAll("\n", "\n * ")}
 */
${modContent}`;
                    await Deno.writeTextFile(mod, newModContent);
                }
            }
        }
    }
}
