import { assert as ok, assertEquals as equals, assertFalse as no } from "jsr:@std/assert@^0.224.0";
import { BROWSER, BUN, CLOUDFLARE, DENO, NODE, NODELIKE, RUNTIME } from "./mod.ts";

Deno.test("runtime", () => {
    equals(RUNTIME, "deno");
    no(BUN);
    no(NODE);
    no(BROWSER);
    no(CLOUDFLARE);
    no(NODELIKE);
    ok(DENO);
});

Deno.test("deno scenario", async () => {
    const cmd = new Deno.Command("deno", {
        args: ["run", "-A", "./scenarios/bun.ts"],
        stdout: "piped",
        stderr: "piped",
    });

    const output = await cmd.output();
    const decoder = new TextDecoder();
    const text = decoder.decode(output.stdout);

    equals(text, "deno\n");
});

Deno.test("node scenario", async () => {
    const cmd = new Deno.Command("ts-node", {
        args: ["./scenarios/node.ts"],
        stdout: "piped",
        stderr: "piped",
    });

    const output = await cmd.output();
    const decoder = new TextDecoder();
    const text = decoder.decode(output.stdout);

    equals(text, "node\n");
});

Deno.test("bun scenario", async () => {
    const cmd = new Deno.Command("bun", {
        args: ["./scenarios/bun.ts"],
        stdout: "piped",
        stderr: "piped",
    });

    const output = await cmd.output();
    const decoder = new TextDecoder();
    const text = decoder.decode(output.stdout);

    equals(text, "bun\n");
});
