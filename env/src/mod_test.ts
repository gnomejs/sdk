import { env } from "./mod.ts";
import { assertEquals as equals } from "@std/assert";

Deno.test("ensure env loads from mod", () => {
    env.set("TEST", "value");
    equals(env.get("TEST"), "value");
});
