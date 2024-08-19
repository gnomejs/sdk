import { ok } from "@gnome/assert";
import { startsWithFold } from "./starts_with.ts";

Deno.test("strings::startsWithFold", () => {
    ok(startsWithFold("Hello sdf", "hello"));
    ok(startsWithFold("Hello", "HELLO"));
});
