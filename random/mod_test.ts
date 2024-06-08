import { getRandomValues, randomBytes, randomFileName, randomUUID } from "./mod.ts";
import { assertEquals, assertMatch, assertNotEquals } from "@std/assert";

Deno.test("randomUUID", () => {
    const uuid = randomUUID();
    assertEquals(uuid.length, 36);
    const parts = uuid.split("-");
    assertEquals(parts.length, 5);

    const uuid2 = randomUUID();
    assertEquals(uuid2.length, 36);
    assertNotEquals(uuid, uuid2);
});

Deno.test("randomBytes", () => {
    const bytes = randomBytes(32);
    assertEquals(bytes.length, 32);
    const bytes2 = randomBytes(32);
    assertEquals(bytes2.length, 32);
    assertNotEquals(bytes, bytes2);
});

Deno.test("randomFileName", () => {
    const fileName = randomFileName();
    assertEquals(fileName.length, 12);
    const fileName2 = randomFileName();
    assertEquals(fileName2.length, 12);
    assertNotEquals(fileName, fileName2);

    const fileName3 = randomFileName(16, "prefix_");
    assertEquals(fileName3.length, 23);
    assertEquals(fileName3.startsWith("prefix_"), true);

    const fileName4 = randomFileName(16, "prefix_", "abc");
    console.log(fileName4, "end");
    assertEquals(fileName4.length, 23);
    assertEquals(fileName4.startsWith("prefix_"), true);
    const parts = fileName4.split("_");
    assertEquals(parts.length, 2);
    assertEquals(parts[1].length, 16);
    assertMatch(parts[1], /[abc]*/);
});

Deno.test("getRandomValues", () => {
    const buffer = new Uint8Array(32);
    getRandomValues(buffer);
    assertEquals(buffer.length, 32);
    const buffer2 = new Uint8Array(32);
    getRandomValues(buffer2);
    assertEquals(buffer2.length, 32);
    assertNotEquals(buffer, buffer2);
});
