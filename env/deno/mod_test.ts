import { env } from "./mod.ts";
import { assert as ok, assertEquals as equals, assertFalse as no, assertThrows } from "@std/assert";

Deno.test("deno env.get", () => {
    env.set("DENO_TEST_1", "value");
    equals(env.get("DENO_TEST_1"), "value");
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

Deno.test("deno env.has", () => {
    env.set("DENO_TEST_2", "value");
    ok(env.has("DENO_TEST_2"));
    no(env.has("NOT_SET"));
});

Deno.test("deno env.remove", () => {
    env.set("DENO_TEST_2_1", "value");
    ok(env.has("DENO_TEST_2_1"));
    env.remove("DENO_TEST_2_1");
    no(env.has("DENO_TEST_2_1"));
});

Deno.test("deno env.merge", () => {
    env.set("DENO_TEST_3", "value");
    env.merge({ "DENO_TEST_4": "value", "DENO_TEST_3": undefined });
    no(env.has("DENO_TEST_3"));
    ok(env.has("DENO_TEST_4"));
});

Deno.test("deno env.iterator", () => {
    env.set("DENO_TEST_TEST5", "value");
    const envs: Array<{ key: string; value: string }> = [];
    for (const e of env) {
        envs.push(e);
    }

    ok(envs.length > 0);
    ok(envs.some((e) => e.key === "DENO_TEST_TEST5" && e.value === "value"));
});

Deno.test("deno env.toObject", () => {
    env.set("DENO_TEST_6", "value");
    const obj = env.toObject();
    ok(obj.DENO_TEST_6 === "value");
});

Deno.test("deno env.set", () => {
    env.set("DENO_TEST_7", "value");
    ok(env.has("DENO_TEST_7"));
});

Deno.test("deno env.path.append", () => {
    env.path.append("/deno_test_append");
    ok(env.path.has("/deno_test_append"));
    const paths = env.path.split();
    equals(paths[paths.length - 1], "/deno_test_append");
    env.path.remove("/deno_test_append");
    no(env.path.has("/deno_test_append"));
});

Deno.test("deno env.path.prepend", () => {
    env.path.prepend("/deno_test_prepend");
    ok(env.path.has("/deno_test_prepend"));
    const paths = env.path.split();
    equals(paths[0], "/deno_test_prepend");
    env.path.remove("/deno_test_prepend");
    no(env.path.has("/deno_test_prepend"));
});

Deno.test("deno env.path.remove", () => {
    env.path.append("/deno_test_remove");
    ok(env.path.has("/deno_test_remove"));
    env.path.remove("/deno_test_remove");
    no(env.path.has("/deno_test_remove"));
});

Deno.test("deno env.path.replace", () => {
    env.path.append("/test_replace");
    ok(env.path.has("/test_replace"));
    env.path.replace("/test_replace", "/test2");
    no(env.path.has("/test_replace"));
    ok(env.path.has("/test2"));
    env.path.remove("/test2");
});

Deno.test("deno env.path.split", () => {
    env.path.append("/deno_test12");
    const paths = env.path.split();
    ok(paths.length > 0);
    ok(paths.some((p) => p === "/deno_test12"));
});

Deno.test("deno env.path.toString", () => {
    env.path.append("/deno_test13");
    ok(env.path.toString().includes("/deno_test13"));
});

Deno.test("deno env.path.has", () => {
    env.path.append("/deno_test14");
    ok(env.path.has("/deno_test14"));
    no(env.path.has("/deno_test15"));
});

Deno.test("deno env.path.get", () => {
    env.path.append("/deno_test16");
    ok(env.path.get().includes("/deno_test16"));
});

Deno.test("deno env.path.overwrite", () => {
    const p = env.path.toString();
    try {
        env.path.append("/deno_test17");

        env.path.overwrite("/deno_test18");
        ok(env.path.get().includes("/deno_test18"));
    } finally {
        env.path.overwrite(p);
    }
});

Deno.test("deno env.path.iterator", () => {
    env.path.append("/deno_test19");
    const paths: Array<string> = [];
    for (const p of env.path) {
        paths.push(p);
    }
    ok(paths.length > 0);
    ok(paths.some((p) => p === "/deno_test19"));
});

Deno.test("deno env.joinPath", () => {
    const paths = ["/deno_test20", "/deno_test21"];
    const joined = env.joinPath(paths);
    ok(joined.includes("/deno_test20"));
    ok(joined.includes("/deno_test21"));
});


Deno.test("deno env.getBool", () => {
    env.set("TEST_BOOL", "1");
    env.set("NON_BOOL", "bool");

    ok(env.getBool("TEST_BOOL"));
    ok(!env.getBool("NON_BOOL"));
    ok(env.getBool("NO_EXIST") === undefined);
});


Deno.test("deno env.getInt", () => {
    env.set("TEST_INT", "1");
    env.set("NON_INT", "int");

    equals(env.getInt("TEST_INT"), 1);
    ok(env.getInt("NON_INT") === undefined);
    ok(env.getInt("NO_EXIST") === undefined);
});

Deno.test("deno env.getNumber", () => {
    env.set("TEST_FLOAT", "1.1");
    env.set("NON_FLOAT", "float");
 
    equals(env.getNumber("TEST_FLOAT"), 1.1);
    ok(env.getNumber("NON_FLOAT") === undefined);
    ok(env.getNumber("NO_EXIST") === undefined);
});

Deno.test("deno env.getArray", () => {
    env.set("TEST_ARRAY", "1,2,3");
    env.set("NON_ARRAY", "array");

    equals(env.getArray("TEST_ARRAY"), ["1", "2", "3"]);
    equals(env.getArray("NON_ARRAY"), ["array"]);
    ok(env.getArray("NO_EXIST") === undefined);

    env.set("TEST_ARRAY", "1;2;3");
    equals(env.getArray("TEST_ARRAY", ";"), ["1", "2", "3"], "Delimiter is not correctly set");
});

Deno.test("deno env.getDate", () => {
    env.set("TEST_DATE", "2021-01-01");
    env.set("NON_DATE", "date");

    equals(env.getDate("TEST_DATE"), new Date("2021-01-01"), "Date is not set or does not match");
    ok(env.getDate("NON_DATE") === undefined, "Non-date value is not undefined");
    ok(env.getDate("NO_EXIST") === undefined);
});

Deno.test("deno env.getJson", () => {
    env.set("TEST_JSON", '{"key": "value"}');
    env.set("NON_JSON", "json");

    equals(env.getJson("TEST_JSON"), { key: "value" });
    ok(env.getJson("NON_JSON") === undefined);
    ok(env.getJson("NO_EXIST") === undefined);
})

Deno.test("deno env.getBinary", () => {
    env.set("TEST_BINARY", "SGVsbG8gV29ybGQ=");
    env.set("NON_BINARY", "binary");

    equals(env.getBinary("TEST_BINARY"), new TextEncoder().encode("Hello World"), "Binary value is not set or does not match");
    ok(env.getBinary("NO_EXIST") === undefined);
});