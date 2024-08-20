import { WINDOWS } from "@gnome/os-constants";
import { which, whichSync } from "./which.ts";
import { assert as ok, assertEquals as equals } from "jsr:@std/assert@0.225.0";

Deno.test("which", async () => {
    const node = await which("node");
    ok(node);
    if (WINDOWS) {
        equals(node.substring(node.length - 8), "node.exe");
    } else {
        equals(node.substring(node.length - 4), "node");
    }
});

Deno.test("whichSync", () => {
    const node = whichSync("node");
    ok(node);
    if (WINDOWS) {
        equals(node.substring(node.length - 8), "node.exe");
    } else {
        equals(node.substring(node.length - 4), "node");
    }
});
