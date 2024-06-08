import { WINDOWS } from "@gnome/os-constants";
import { StringBuilder } from "./string-builder.ts";
import { assertEquals as equals } from "@std/assert";
import { toCharCodeArray } from "./utils.ts";

Deno.test("appendString", () => {
    const sb = new StringBuilder();
    sb.appendString("test");
    equals(sb.toString(), "test");
});

Deno.test("appendUint8Array", () => {
    const sb = new StringBuilder();
    sb.appendUint8Array(toCharCodeArray("test"));
    equals(sb.toString(), "test");
});

Deno.test("appendLine", () => {
    const sb = new StringBuilder();
    sb.appendLine("test");
    if (WINDOWS) {
        equals(sb.toString(), "test\r\n");
        return;
    }
    equals(sb.toString(), "test\n");
});

Deno.test("appendCode", () => {
    const sb = new StringBuilder();
    sb.appendCode(116);
    equals(sb.toString(), "t");
});

Deno.test("appendChar", () => {
    const sb = new StringBuilder();
    sb.appendChar("t");
    equals(sb.toString(), "t");
});

Deno.test("append", () => {
    const sb = new StringBuilder();
    sb.append("test");
    equals(sb.toString(), "test");
    sb.append(toCharCodeArray("test"));
    equals(sb.toString(), "testtest");
    sb.append(new StringBuilder().appendString("test"));
    equals(sb.toString(), "testtesttest");
});

Deno.test("clear", () => {
    const sb = new StringBuilder();
    sb.append("test");
    sb.clear();
    equals(sb.toString(), "");
    equals(sb.length, 0);
});
