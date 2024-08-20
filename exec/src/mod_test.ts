import { output } from "./mod.ts";
import { assert as ok, assertEquals as equals } from "jsr:@std/assert@^0.224.0";

Deno.test("ensure env loads from mod", async () => {
    const out = await output("deno", ["--version"]);
    equals(out.code, 0);
    ok(out.text().includes("deno"));
});
