import { ok } from "@gnome/assert";
import { errorf } from "./errorf.ts";

Deno.test("errors::errorf", () => {
    const e = errorf("An error occurred: %s", "Something went wrong.");
    ok(e instanceof Error);
    ok(e.message.startsWith("An error occurred: Something went wrong."));
    ok(e.stack);
});
