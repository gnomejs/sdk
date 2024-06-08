import { assert as ok, assertEquals as equals, assertFalse as no } from "@std/assert";
import {
    Char,
    charAt,
    isAscii,
    isAsciiAt,
    isBetween,
    isDigit,
    isDigitAt,
    isDigitUtf16At,
    isLatin1,
    isLatin1At,
    isLetter,
    isLetterAt,
    isLetterOrDigit,
    isLetterOrDigitAt,
    isLetterOrDigitUtf16At,
    isLetterUtf16At,
    isLower,
    isLowerAt,
    isLowerUtf16,
    isLowerUtf16At,
    isUpper,
    isUpperAt,
    isUpperUtf16,
    isUpperUtf16At,
    isWhiteSpace,
    isWhiteSpaceAt,
    toLower,
    toLowerUtf16,
    toUpper,
    toUpperUtf16,
} from "./mod.ts";

Deno.test("Char", () => {
    const char = new Char(65);
    equals(char.toString(), "A");
    equals(char.valueOf(), 65);
    equals(char.value, 65);
});

Deno.test("charAt should return the correct character", () => {
    const value = "Hello, World!";
    equals(charAt(value, 0).toString(), "H");
    equals(charAt(value, 7).toString(), "W");
});

Deno.test("isAscii should return true for ASCII characters", () => {
    ok(isAscii(65));
    ok(isAscii(97));
    no(isAscii(270));
});

Deno.test("isAsciiAt should return true for ASCII characters at the specified index", () => {
    const value = "Hello, World!ö";
    ok(isAsciiAt(value, 0));
    ok(isAsciiAt(value, 7));
    no(isAsciiAt(value, 13));
});

Deno.test("isBetween should return true if the value is between the start and end characters", () => {
    ok(isBetween(65, 65, 90));
    no(isBetween(97, 65, 90));
    ok(isBetween(100, 97, 122));
});

Deno.test("isDigit should return true for digit characters", () => {
    ok(isDigit(48));
    ok(isDigit(57));
    no(isDigit(65));
});

Deno.test("isDigitAt should return true for digit characters at the specified index", () => {
    const value = "Hello, 123!";
    ok(isDigitAt(value, 7));
    ok(isDigitAt(value, 9));
    no(isDigitAt(value, 5));
});

Deno.test("isDigitUtf16At should return true for digit characters at the specified index", () => {
    const value = "Hello, 123!";
    ok(isDigitUtf16At(value, 7));
    ok(isDigitUtf16At(value, 9));
    no(isDigitUtf16At(value, 5));
});

Deno.test("isLatin1 should return true for Latin-1 characters", () => {
    ok(isLatin1(65));
    no(isLatin1(256));
});

Deno.test("isLatin1At should return true for Latin-1 characters at the specified index", () => {
    const value = "Hello, World!Ϩ";
    ok(isLatin1At(value, 0));
    ok(isLatin1At(value, 7));
    no(isLatin1At(value, 13));
});

Deno.test("isLetter should return true for letter characters", () => {
    ok(isLetter(65));
    ok(isLetter(97));
    no(isLetter(48));
    ok(isLetter(270));
    ok(isLetter(1000));
});

Deno.test("isLetterAt should return true for letter characters at the specified index", () => {
    const value = "Hello, World!";
    ok(isLetterAt(value, 0));
    ok(isLetterAt(value, 7));
    no(isLetterAt(value, 12));
});

Deno.test("isLetterUtf16At should return true for letter characters at the specified index", () => {
    const value = "Hello, World!";
    ok(isLetterUtf16At(value, 0));
    ok(isLetterUtf16At(value, 7));
    no(isLetterUtf16At(value, 12));
});

Deno.test("isLetterOrDigit should return true for letter or digit characters", () => {
    ok(isLetterOrDigit(65));
    ok(isLetterOrDigit(97));
    ok(isLetterOrDigit(48));
    no(isLetterOrDigit(33));
});

Deno.test("isLetterOrDigitAt should return true for letter or digit characters at the specified index", () => {
    const value = "Hello, 123!";
    ok(isLetterOrDigitAt(value, 0));
    ok(isLetterOrDigitAt(value, 7));
    ok(isLetterOrDigitAt(value, 9));
    no(isLetterOrDigitAt(value, 5));
});

Deno.test("isLetterOrDigitUtf16At should return true for letter or digit characters at the specified index", () => {
    const value = "Hello, 123!";
    ok(isLetterOrDigitUtf16At(value, 0));
    ok(isLetterOrDigitUtf16At(value, 7));
    ok(isLetterOrDigitUtf16At(value, 9));
    no(isLetterOrDigitUtf16At(value, 5));
});

Deno.test("isLower should return true for lowercase characters", () => {
    no(isLower(65));
    ok(isLower(97));
    no(isLower(48));
});

Deno.test("isLowerAt should return true for lowercase characters at the specified index", () => {
    const value = "Hello, World!";
    no(isLowerAt(value, 0));
    ok(isLowerAt(value, 2));
    no(isLowerAt(value, 7));
    no(isLowerAt(value, 12));
});

Deno.test("isLowerUtf16 should return true for lowercase characters", () => {
    no(isLowerUtf16(65));
    ok(isLowerUtf16(97));
    no(isLowerUtf16(48));
});

Deno.test("isLowerUtf16At should return true for lowercase characters at the specified index", () => {
    const value = "Hello, World!";
    no(isLowerUtf16At(value, 0));
    ok(isLowerUtf16At(value, 2));
    no(isLowerUtf16At(value, 12));
});

Deno.test("isDigit", () => {
    ok(isDigit(48), "char code 48 should be a digit");
    ok(isDigit(49), "char code 49 should be a digit");
    ok(isDigitAt("0", 0), "should be a digit");
    ok(!isDigitAt("a", 0), "should not be a digit");
});

Deno.test("isLetter", () => {
    ok(isLetter(65), "char code 65 should be a letter");
    ok(isLetter(97), "char code 97 should be a letter");
    ok(isLetterAt("a", 0), "should be a letter");
    // test umlauts
    ok(isLetterUtf16At("ä", 0), "should be a letter");
    ok(!isLetterAt("0", 0), "should not be a letter");
});

Deno.test("isLetterOrDigit", () => {
    ok(isLetterOrDigit(65), "char code 65 should be a letter or digit");
    ok(isLetterOrDigit(97), "char code 97 should be a letter or digit");
    ok(isLetterOrDigit(48), "char code 48 should be a letter or digit");
    ok(isLetterOrDigitAt("a", 0), "should be a letter or digit");
    ok(isLetterOrDigitAt("0", 0), "should be a letter or digit");
    ok(!isLetterOrDigitAt("!", 0), "should not be a letter or digit");
});

Deno.test("isUpper", () => {
    ok(isUpper(65), "char code 65 should be upper case");
    ok(isUpperAt("A", 0), "should be upper case");
    no(isUpperAt("a", 0), "should not be upper case");
});

Deno.test("isUpperUtf16", () => {
    ok(isUpperUtf16(65), "char code 65 should be upper case");
    ok(isUpperUtf16At("A", 0), "should be upper case");
    ok(!isUpperUtf16At("a", 0), "should not be upper case");
});

Deno.test("isLower", () => {
    ok(isLower(97), "char code 97 should be lower case");
    ok(isLowerAt("a", 0), "should be lower case");
    ok(!isLowerAt("A", 0), "should not be lower case");
});

Deno.test("isWhiteSpace", () => {
    ok(isWhiteSpace(32), "char code 32 should be a whitespace");
    ok(isWhiteSpace(9), "char code 9 should be a whitespace");
    ok(isWhiteSpace(10), "char code 10 should be a whitespace");
    ok(isWhiteSpace(13), "char code 13 should be a whitespace");
    ok(isWhiteSpace(12), "char code 12 should be a whitespace");
    ok(isWhiteSpace(160), "char code 160 should be a whitespace");
    ok(isWhiteSpace(65279), "char code 65279 should be a whitespace");
    ok(isWhiteSpaceAt(" ", 0), "should be a whitespace");
    ok(isWhiteSpaceAt("\t", 0), "should be a whitespace");
    ok(isWhiteSpaceAt("\n", 0), "should be a whitespace");
    ok(isWhiteSpaceAt("\r", 0), "should be a whitespace");
    ok(isWhiteSpaceAt("\f", 0), "should be a whitespace");
    ok(isWhiteSpaceAt("\u00A0", 0), "should be a whitespace");
    ok(isWhiteSpaceAt("\uFEFF", 0), "should be a whitespace");
    no(isWhiteSpaceAt("a", 0), "should not be a whitespace");
});

Deno.test("toUpper", () => {
    equals(toUpper(97), 65, "char code 97 should be converted to 65");
    equals(toUpper(65), 65, "char code 65 should be converted to 65");
    equals(toUpper(48), 48, "char code 48 should be converted to 48");
    equals(toUpper(270), 270, "char code 270 should be converted to 270");
    equals(toUpper(1000), 1000, "char code 1000 should be converted to 1000");
});

Deno.test("toLower", () => {
    equals(toLower(65), 97, "char code 65 should be converted to 97");
    equals(toLower(97), 97, "char code 97 should be converted to 97");
    equals(toLower(48), 48, "char code 48 should be converted to 48");
    equals(toLower(270), 271, "char code 270 should be converted to 271");
    equals(toLower(1000), 1001, "char code 1000 should be converted to 1000");
});

Deno.test("toUpperUtf16", () => {
    equals(toUpperUtf16("a".charCodeAt(0)), 65, "char code 97 should be converted to 65");
    equals(toUpperUtf16("A".charCodeAt(0)), 65, "char code 65 should be converted to 65");
    equals(toUpperUtf16("0".charCodeAt(0)), 48, "char code 48 should be converted to 48");
    equals(toUpperUtf16("Ϩ".charCodeAt(0)), 1000, "char code 1000 should be converted to 1000");
});

Deno.test("toLowerUtf16", () => {
    equals(toLowerUtf16("A".charCodeAt(0)), 97, "char code 65 should be converted to 97");
    equals(toLowerUtf16("a".charCodeAt(0)), 97, "char code 97 should be converted to 97");
    equals(toLowerUtf16("0".charCodeAt(0)), 48, "char code 48 should be converted to 48");
    equals(toLowerUtf16("Ϩ".charCodeAt(0)), 1001, "char code 270 should be converted to 1001");
});
