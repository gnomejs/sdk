import { assert as ok, assertEquals as equals, assertFalse as no } from "@std/assert";
import * as str from "./utils.ts";

Deno.test("trim", () => {
    equals(str.trim("  abc  "), "abc");
    equals(str.trim("  abc  ", " "), "abc");
    equals(str.trim("  abc  ", " a"), "bc");
    equals(str.trim("  abc  ", " a b c"), "");
});

Deno.test("trimStart", () => {
    equals(str.trimStart("  abc  "), "abc  ");
    equals(str.trimStart("  abc  ", " "), "abc  ");
    equals(str.trimStart("  abc  ", " a"), "bc  ");
    equals(str.trimStart("  abc  ", " a b c"), "");
});

Deno.test("trimEnd", () => {
    equals(str.trimEnd("  abc  "), "  abc");
    equals(str.trimEnd("  abc  ", " "), "  abc");
    equals(str.trimEnd("  abc  ", " c"), "  ab");
    equals(str.trimEnd("  abc  ", " a b c"), "");
});

Deno.test("endsWithIgnoreCase", () => {
    ok(str.endsWithIgnoreCase("abc", "c"));
    ok(str.endsWithIgnoreCase("abc", "C"));
    ok(str.endsWithIgnoreCase("abc", "Bc"));
    no(str.endsWithIgnoreCase("abc", "b"));
    no(str.endsWithIgnoreCase("abc", "a"));
    no(str.endsWithIgnoreCase("abc", "cab"));
});

Deno.test("startsWithIgnoreCase", () => {
    ok(str.startsWithIgnoreCase("abc", "a"));
    ok(str.startsWithIgnoreCase("abc", "A"));
    ok(str.startsWithIgnoreCase("abc", "Ab"));
    no(str.startsWithIgnoreCase("abc", "b"));
    no(str.startsWithIgnoreCase("abc", "c"));
    no(str.startsWithIgnoreCase("abc", "cab"));
});

Deno.test("indexOfIgnoreCase", () => {
    equals(str.indexOfIgnoreCase("abc", "a"), 0);
    equals(str.indexOfIgnoreCase("abc", "A"), 0);
    equals(str.indexOfIgnoreCase("abc", "Ab"), 0);
    equals(str.indexOfIgnoreCase("abc", "b"), 1);
    equals(str.indexOfIgnoreCase("abc", "bc"), 1);
    equals(str.indexOfIgnoreCase("acdb", "bc"), -1);
    equals(str.indexOfIgnoreCase("abc", "c"), 2);
    equals(str.indexOfIgnoreCase("abc", "cab"), -1);
});

Deno.test("includesIgnoreCase", () => {
    ok(str.includesIgnoreCase("abc", "a"));
    ok(str.includesIgnoreCase("abc", "A"));
    ok(str.includesIgnoreCase("abc", "Ab"));
    ok(str.includesIgnoreCase("abc", "b"));
    ok(str.includesIgnoreCase("abc", "bc"));
    no(str.includesIgnoreCase("acdb", "bc"));
    ok(str.includesIgnoreCase("abc", "c"));
    no(str.includesIgnoreCase("abc", "cab"));
});

Deno.test("equalsIgnoreCase", () => {
    ok(str.equalsIgnoreCase("abc", "abc"));
    ok(str.equalsIgnoreCase("abc", "ABC"));
    ok(str.equalsIgnoreCase("abc", "AbC"));
    no(str.equalsIgnoreCase("abc", "ab"));
    ok(str.equalsIgnoreCase("abc", "abC"));
    no(str.equalsIgnoreCase("abc", "cab"));
});

Deno.test("toCharCodeArray", () => {
    equals(str.toCharCodeArray("abc"), new Uint8Array([97, 98, 99]));
    equals(str.toCharCodeArray("a b c"), new Uint8Array([97, 32, 98, 32, 99]));
});

Deno.test("isWhiteSpaceAt", () => {
    ok(str.isWhiteSpace(" "));
    ok(str.isWhiteSpace("\t"));
    ok(str.isWhiteSpace("\n"));
    ok(str.isWhiteSpace("\r"));
    ok(str.isWhiteSpace("\n \t\n\r"));
    no(str.isWhiteSpace("a"));
    no(str.isWhiteSpace("1"));
    no(str.isWhiteSpace("A"));
});

Deno.test("split", () => {
    equals(str.split("a b c", " "), ["a", "b", "c"]);
    equals(str.split("a b c", " "), ["a", "b", "c"]);
    equals(str.split("a b c", "b"), ["a ", " c"]);
    equals(str.split("a b c", "c"), ["a b ", ""]);
    equals(str.split("a b c", "d"), ["a b c"]);

    equals(str.split("a:=b c", ":="), ["a", "b c"]);
    equals(str.split(new TextEncoder().encode("a b d"), " "), ["a", "b", "d"]);
});

Deno.test("isNullOrEmpty", () => {
    ok(str.isNullOrEmpty(""));
    ok(str.isNullOrEmpty(null));
    ok(str.isNullOrEmpty(undefined));
    no(str.isNullOrEmpty("a"));
    no(str.isNullOrEmpty(" "));
    no(str.isNullOrEmpty("  "));
});

Deno.test("isNullOrWhiteSpace", () => {
    ok(str.isNullOrWhiteSpace(""));
    ok(str.isNullOrWhiteSpace(null));
    ok(str.isNullOrWhiteSpace(undefined));
    ok(str.isNullOrWhiteSpace(" "));
    ok(str.isNullOrWhiteSpace("  "));
    no(str.isNullOrWhiteSpace("a"));
    no(str.isNullOrWhiteSpace(" a"));
    no(str.isNullOrWhiteSpace(" a "));
});

Deno.test("toCharacterArray", () => {
    equals(str.toCharacterArray("abc"), ["a", "b", "c"]);
    equals(str.toCharacterArray("a b c"), ["a", " ", "b", " ", "c"]);
});
