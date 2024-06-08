import { writer } from "./writer.ts";
import { assert as ok } from "jsr:@std/assert@0.225.3";

Deno.test("write to stdout", () => {
    writer.debug("debug");
    writer.info("info");
    writer.warn("warn");
    writer.error("error");
    writer.progress("progress", 10);
    writer.progress("progress", 100);
    writer.writeLine();
    writer.command("az", ["login"]);
    writer.success("success");
    writer.startGroup("group");
    writer.writeLine(" within group");
    writer.endGroup();
    console.log(writer.interactive);
    ok(true);
});
