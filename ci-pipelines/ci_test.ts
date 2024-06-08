import { CI, CI_PROVIDER } from "./ci.ts";
import { env } from "@gnome/env";
import { assertEquals as equals } from "jsr:@std/assert@0.225.3";

Deno.test("CI constant", () => {
    console.log(CI);
    console.log(CI_PROVIDER);
    equals(CI, CI_PROVIDER !== "local" || env.get("CI") === "true");
});
