import { ok } from "@gnome/assert";
import { equalFold } from "./equal.ts";

Deno.test("strings::equalFold", () => {
    ok(equalFold("Hello", "hello"));
    ok(equalFold("Hello", "HELLO"));
});
