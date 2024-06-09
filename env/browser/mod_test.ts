import { env } from "./mod.ts";
import { assert as ok, assertEquals as equals, assertFalse as no, assertThrows } from "@std/assert";

Deno.test("browser env.get", () => {
    env.set("TEST", "value");
    equals(env.get("TEST"), "value");
});

Deno.test("browser env.expand", () => {
    env.set("NAME", "Alice");
    equals(env.expand("Hello, ${NAME}! You are ${AGE:-30} years old."), "Hello, Alice! You are 30 years old.");
    equals(env.expand("HELLO, %NAME%!"), "HELLO, Alice!");

    env.expand("${AGE_NEXT:=30}");
    equals(env.get("AGE_NEXT"), "30");

    assertThrows(() => {
        env.expand("${AGE_NEXT2:?Missing environment variable AGE_NEXT2}");
    }, "Missing environment variable AGE_NEXT2");
});

Deno.test("browser env.has", () => {
    env.set("TEST", "value");
    ok(env.has("TEST"));
    no(env.has("NOT_SET"));
});

Deno.test("browser env.remove", () => {
    env.set("TEST2", "value");
    ok(env.has("TEST2"));
    env.remove("TEST2");
    no(env.has("TEST2"));
});

Deno.test("browser env.merge", () => {
    env.set("TEST3", "value");
    env.merge({ "TEST4": "value", "TEST3": undefined });
    no(env.has("TEST3"));
    ok(env.has("TEST4"));
});

Deno.test("browser env.iterator", () => {
    env.set("TEST5", "value");
    const envs: Array<{ key: string; value: string }> = [];
    for (const e of env) {
        envs.push(e);
    }

    ok(envs.length > 0);
    ok(envs.some((e) => e.key === "TEST5" && e.value === "value"));
});

Deno.test("browser env.toObject", () => {
    env.set("TEST6", "value");
    const obj = env.toObject();
    ok(obj.TEST6 === "value");
});

Deno.test("browser env.set", () => {
    env.set("TEST7", "value");
    ok(env.has("TEST7"));
});

Deno.test("browser env.path.append", () => {
    env.path.append("/test");
    console.log(env.path.get());
    ok(env.path.has("/test"));
    const paths = env.path.split();
    equals(paths[paths.length - 1], "/test");
    env.path.remove("/test");
    no(env.path.has("/test"));
});

Deno.test("browser env.path.prepend", () => {
    env.path.prepend("/test");
    ok(env.path.has("/test"));
    const paths = env.path.split();
    equals(paths[0], "/test");
    env.path.remove("/test");
    no(env.path.has("/test"));
});

Deno.test("browser env.path.remove", () => {
    env.path.append("/test");
    ok(env.path.has("/test"));
    env.path.remove("/test");
    no(env.path.has("/test"));
});

Deno.test("browser env.path.replace", () => {
    env.path.append("/test");
    ok(env.path.has("/test"));
    env.path.replace("/test", "/test2");
    no(env.path.has("/test"));
    ok(env.path.has("/test2"));
});

Deno.test("browser env.path.split", () => {
    env.path.append("/test12");
    const paths = env.path.split();
    ok(paths.length > 0);
    ok(paths.some((p) => p === "/test12"));
});

Deno.test("browser env.path.toString", () => {
    env.path.append("/test13");
    ok(env.path.toString().includes("/test13"));
});

Deno.test("browser env.path.has", () => {
    env.path.append("/test14");
    ok(env.path.has("/test14"));
    no(env.path.has("/test15"));
});

Deno.test("browser env.path.get", () => {
    env.path.append("/test16");
    ok(env.path.get().includes("/test16"));
});

Deno.test("browser env.path.overwrite", () => {
    env.path.append("/test17");
    env.path.overwrite("/test18");
    ok(env.path.get().includes("/test18"));
});

Deno.test("browser env.path.iterator", () => {
    env.path.append("/test19");
    const paths: Array<string> = [];
    for (const p of env.path) {
        paths.push(p);
    }
    ok(paths.length > 0);
    ok(paths.some((p) => p === "/test19"));
});

Deno.test("browser env.join", () => {
    const paths = ["/test20", "/test21"];
    const joined = env.joinPath(paths);
    ok(joined.includes("/test20"));
    ok(joined.includes("/test21"));
});


Deno.test("browser env.getBool", () => {
    env.set("TEST_BOOL", "1");
    env.set("NON_BOOL", "bool");

    ok(env.getBool("TEST_BOOL"));
    ok(!env.getBool("NON_BOOL"));
    ok(env.getBool("NO_EXIST") === undefined);
});


Deno.test("browser env.getInt", () => {
    env.set("TEST_INT", "1");
    env.set("NON_INT", "int");

    equals(env.getInt("TEST_INT"), 1);
    ok(env.getInt("NON_INT") === undefined);
    ok(env.getInt("NO_EXIST") === undefined);
});

Deno.test("browser env.getNumber", () => {
    env.set("TEST_FLOAT", "1.1");
    env.set("NON_FLOAT", "float");
 
    equals(env.getNumber("TEST_FLOAT"), 1.1);
    ok(env.getNumber("NON_FLOAT") === undefined);
    ok(env.getNumber("NO_EXIST") === undefined);
});

Deno.test("browser env.getArray", () => {
    env.set("TEST_ARRAY", "1,2,3");
    env.set("NON_ARRAY", "array");

    equals(env.getArray("TEST_ARRAY"), ["1", "2", "3"]);
    equals(env.getArray("NON_ARRAY"), ["array"]);
    ok(env.getArray("NO_EXIST") === undefined);

    env.set("TEST_ARRAY", "1;2;3");
    equals(env.getArray("TEST_ARRAY", ";"), ["1", "2", "3"], "Delimiter is not correctly set");
});

Deno.test("browser env.getDate", () => {
    env.set("TEST_DATE", "2021-01-01");
    env.set("NON_DATE", "date");

    equals(env.getDate("TEST_DATE"), new Date("2021-01-01"), "Date is not set or does not match");
    ok(env.getDate("NON_DATE") === undefined, "Non-date value is not undefined");
    ok(env.getDate("NO_EXIST") === undefined);
});

Deno.test("browser env.getJson", () => {
    env.set("TEST_JSON", '{"key": "value"}');
    env.set("NON_JSON", "json");

    equals(env.getJson("TEST_JSON"), { key: "value" });
    ok(env.getJson("NON_JSON") === undefined);
    ok(env.getJson("NO_EXIST") === undefined);
})

Deno.test("browser env.getBinary", () => {
    env.set("TEST_BINARY", "SGVsbG8gV29ybGQ=");
    env.set("NON_BINARY", "binary");

    equals(env.getBinary("TEST_BINARY"), new TextEncoder().encode("Hello World"), "Binary value is not set or does not match");
    ok(env.getBinary("NO_EXIST") === undefined);
});