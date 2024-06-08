import { splitArguments } from "./split-arguments.ts";
import { assert as ok, assertEquals as equals } from "jsr:@std/assert@0.225.0";

Deno.test("splitArguments", () => {
    const args = splitArguments("deno run --allow-read mod.ts");
    ok(args.length === 4);
    ok(args[0] === "deno");
    ok(args[1] === "run");
    ok(args[2] === "--allow-read");
    ok(args[3] === "mod.ts");
});

Deno.test("splitArguments with quotes", () => {
    const args = splitArguments('deno run --allow-read "mod.ts"');
    ok(args.length === 4);
    ok(args[0] === "deno");
    ok(args[1] === "run");
    ok(args[2] === "--allow-read");
    ok(args[3] === "mod.ts");
});

Deno.test("splitArguments with escaped quotes", () => {
    const args = splitArguments('deno run --allow-read \\"mod.ts\\"');
    ok(args.length === 4);
    ok(args[0] === "deno");
    ok(args[1] === "run");
    ok(args[2] === "--allow-read");
    console.log(args[3]);
    equals(args[3], '\\"mod.ts\\"');
});

Deno.test("splitArguments with quotes that has spaces", () => {
    const args = splitArguments('deno run --allow-read "path\\next folder\\mod.ts"');
    console.log(args.length);
    ok(args.length === 4);
    ok(args[0] === "deno");
    ok(args[1] === "run");
    ok(args[2] === "--allow-read");
    equals(args[3], "path\\next folder\\mod.ts");
});

Deno.test("splitArguments with quotes that has spaces and escaped quotes", () => {
    const args = splitArguments('deno run --allow-read "path\\next folder\\\\"mod.ts\\"');

    console.log(args);
    ok(args[0] === "deno");
    ok(args[1] === "run");
    ok(args[2] === "--allow-read");
    equals(args[3], `path\\next folder\\"mod.ts"`);
});

Deno.test("splitArguments with quotes", () => {
    const args = splitArguments("deno run --allow-read ' whatever i want '");
    ok(args.length === 4);
    ok(args[0] === "deno");
    ok(args[1] === "run");
    ok(args[2] === "--allow-read");
    ok(args[3] === " whatever i want ");
});
