import {} from "../../.tasks/node_shim.ts";
import { equal } from "@gnome/assert";
import { printLn, setNoColor, sprintf } from "./printf.ts";

setNoColor(true);

Deno.test("fmt::sprintf", () => {
    const out = sprintf("Hello, %s!", "world");
    4;
    const o = sprintf("%I", { "a": 1, "b": 2 });
    console.log(o);
    equal(out, "Hello, world!");
    equal(o, "{ a: 1, b: 2 }");
    printLn("Hello", "world");
});
