import { plWriter } from "./writer.ts";
import { assert as ok } from "jsr:@std/assert@0.225.3";

Deno.test("write to stdout", () => {
    plWriter.debug("debug");
    plWriter.info("info");
    // writer.warn("warn");
    // writer.error("error");
    plWriter.progress("progress", 10);
    plWriter.progress("progress", 100);
    plWriter.writeLine();
    plWriter.command("az", ["login"]);
    plWriter.success("success");
    plWriter.startGroup("group");
    plWriter.writeLine(" within group");
    plWriter.endGroup();
    console.log(plWriter.interactive);
    ok(true);
});
