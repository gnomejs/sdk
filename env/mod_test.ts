import { env } from "./mod.ts";
import { assertEquals as equals } from "jsr:@std/assert@^0.224.0";

Deno.test("ensure env loads from mod", () => {
    env.set("TEST", "value");
    equals(env.get("TEST"), "value");
});
