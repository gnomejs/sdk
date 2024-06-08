import { assert as ok, assertEquals as equals, assertFalse as no, assertThrows } from "jsr:@std/assert@^0.224.0";
import process from "node:process";

// deno-lint-ignore no-explicit-any
const g = globalThis as any;
g.process = process;

const env = (await import("./mod.ts")).env;

Deno.test("node env.get", () => {
    env.set("NODE_TEST_1", "value");
    equals(env.get("NODE_TEST_1"), "value");
});

Deno.test("node env.has", () => {
    env.set("NODE_TEST_2", "value");
    ok(env.has("NODE_TEST_2"));
    no(env.has("NOT_SET"));
});

Deno.test("deno env.expand", () => {
    env.set("NAME", "Alice");
    equals(env.expand("Hello, ${NAME}! You are ${AGE:-30} years old."), "Hello, Alice! You are 30 years old.");
    equals(env.expand("HELLO, %NAME%!"), "HELLO, Alice!");

    env.expand("${AGE_NEXT:=30}");
    equals(env.get("AGE_NEXT"), "30");

    assertThrows(() => {
        env.expand("${AGE_NEXT2:?Missing environment variable AGE_NEXT2}");
    }, "Missing environment variable AGE_NEXT2");
});

// https://github.com/denoland/deno/issues/23641 can't remove env vars in deno
// for the node polyfill
/*
Deno.test("node env.remove", () => {
    env.set("NODE_TEST_2_1", "value")
    ok(env.has("NODE_TEST_2_1"))
    env.remove("NODE_TEST_2_1")
    no(env.has("NODE_TEST_2_1"))
});

Deno.test("node env.merge", () => {
    env.set("NODE_TEST_3", "value")
    env.merge({ "NODE_TEST_4": "value", "NODE_TEST_3": undefined })
    delete process.env["NODE_TEST_3"]
    no(env.has("NODE_TEST_3"))
    ok(env.has("NODE_TEST_4"))
});
*/

Deno.test("node env.iterator", () => {
    env.set("NODE_TEST_TEST5", "value");
    const envs: Array<{ key: string; value: string }> = [];
    for (const e of env) {
        envs.push(e);
    }

    ok(envs.length > 0);
    ok(envs.some((e) => e.key === "NODE_TEST_TEST5" && e.value === "value"));
});

Deno.test("node env.toObject", () => {
    env.set("NODE_TEST_6", "value");
    const obj = env.toObject();
    ok(obj.NODE_TEST_6 === "value");
});

Deno.test("node env.set", () => {
    env.set("NODE_TEST_7", "value");
    ok(env.has("NODE_TEST_7"));
});

Deno.test("node env.path.append", () => {
    env.path.append("/node_test_append");
    ok(env.path.has("/node_test_append"));
    const paths = env.path.split();
    equals(paths[paths.length - 1], "/node_test_append");
    env.path.remove("/node_test_append");
    no(env.path.has("/node_test_append"));
});

Deno.test("node env.path.prepend", () => {
    env.path.prepend("/node_test_prepend");
    ok(env.path.has("/node_test_prepend"));
    const paths = env.path.split();
    equals(paths[0], "/node_test_prepend");
    env.path.remove("/node_test_prepend");
    no(env.path.has("/node_test_prepend"));
});

Deno.test("node env.path.remove", () => {
    env.path.append("/node_test_remove");
    ok(env.path.has("/node_test_remove"));
    env.path.remove("/node_test_remove");
    no(env.path.has("/node_test_remove"));
});

Deno.test("node env.path.replace", () => {
    env.path.append("/test_replace");
    ok(env.path.has("/test_replace"));
    env.path.replace("/test_replace", "/test2");
    no(env.path.has("/test_replace"));
    ok(env.path.has("/test2"));
    env.path.remove("/test2");
});

Deno.test("node env.path.split", () => {
    env.path.append("/node_test12");
    const paths = env.path.split();
    ok(paths.length > 0);
    ok(paths.some((p) => p === "/node_test12"));
});

Deno.test("node env.path.toString", () => {
    env.path.append("/node_test13");
    ok(env.path.toString().includes("/node_test13"));
});

Deno.test("node env.path.has", () => {
    env.path.append("/node_test14");
    ok(env.path.has("/node_test14"));
    no(env.path.has("/node_test15"));
});

Deno.test("node env.path.get", () => {
    env.path.append("/node_test16");
    ok(env.path.get().includes("/node_test16"));
});

Deno.test("node env.path.overwrite", () => {
    const p = env.path.toString();
    try {
        env.path.append("/node_test17");

        env.path.overwrite("/node_test18");
        ok(env.path.get().includes("/node_test18"));
    } finally {
        env.path.overwrite(p);
    }
});

Deno.test("node env.path.iterator", () => {
    env.path.append("/node_test19");
    const paths: Array<string> = [];
    for (const p of env.path) {
        paths.push(p);
    }
    ok(paths.length > 0);
    ok(paths.some((p) => p === "/node_test19"));
});

Deno.test("node env.joinPath", () => {
    const paths = ["/node_test20", "/node_test21"];
    const joined = env.joinPath(paths);
    ok(joined.includes("/node_test20"));
    ok(joined.includes("/node_test21"));
});
