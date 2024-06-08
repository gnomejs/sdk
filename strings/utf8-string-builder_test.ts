import { WINDOWS } from "@gnome/os-constants";
import { Utf8StringBuilder } from "./utf8-string-builder.ts";
import { assertEquals as equals } from "@std/assert";

Deno.test("appendString", () => {
    const sb = new Utf8StringBuilder();
    sb.appendString("test");
    equals(sb.toString(), "test");
});

Deno.test("appendUint8Array", () => {
    const sb = new Utf8StringBuilder();
    sb.appendUtf8Array(new TextEncoder().encode("test"));
    equals(sb.toString(), "test");
});

Deno.test("appendBuilder", () => {
    const sb = new Utf8StringBuilder();
    sb.appendBuilder(new Utf8StringBuilder().appendString("test"));
    equals(sb.toString(), "test");
});

Deno.test("append", () => {
    const sb = new Utf8StringBuilder();
    sb.append("test");
    equals(sb.toString(), "test");
    sb.append(new TextEncoder().encode("test"));
    equals(sb.toString(), "testtest");
    sb.append(new Utf8StringBuilder().appendString("test"));
    equals(sb.toString(), "testtesttest");
});

Deno.test("appendUtf8Code", () => {
    const sb = new Utf8StringBuilder();
    sb.appendUtf8Char(116);
    equals(sb.toString(), "t");
});

Deno.test("appendChar", () => {
    const sb = new Utf8StringBuilder();
    sb.appendChar("t");
    equals(sb.toString(), "t");
});

Deno.test("appendUtf16Char", () => {
    const sb = new Utf8StringBuilder();
    sb.appendUtf16Char("t".charCodeAt(0));
    equals(sb.toString(), "t");
});

Deno.test("appendLine", () => {
    const sb = new Utf8StringBuilder();
    sb.appendLine("test");
    if (WINDOWS) {
        equals(sb.toString(), "test\r\n");
        return;
    }
    equals(sb.toString(), "test\n");
});
