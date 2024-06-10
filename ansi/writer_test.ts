import { ansiWriter } from "./writer.ts";
import { apply, bgBlue, bold, green } from "./ansi.ts";

Deno.test("writer", () => {
    ansiWriter.write("Hello, World!").writeLine();
    ansiWriter.debug("Hello, World!");
    ansiWriter.info("Hello, World!");
    ansiWriter.success("Hello, World!");
    ansiWriter.writeLine(apply("Hello, World!", bold, green, bgBlue) + " test");
});
