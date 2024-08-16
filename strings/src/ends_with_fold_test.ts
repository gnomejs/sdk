import { ok } from "@gnome/assert";
import { endsWithFold } from "./ends_with_fold.ts";

Deno.test("strings::endsWithFold", () => {

    ok(endsWithFold("sdfsdf Hello", "hello"));
    ok(endsWithFold("Hello", "HELLO"));

});