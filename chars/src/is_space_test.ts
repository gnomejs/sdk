import { ok } from "@gnome/assert"
import { isSpace, isSpaceAt } from "./is_space.ts"

Deno.test("chars::isSpace", () => {
    ok(isSpace(32));
    ok(isSpace(9));
    ok(isSpace(10));
    ok(isSpace(11));
    ok(isSpace(12));
    ok(isSpace(13));
    ok(isSpace(133));
    ok(isSpace(160));
    ok(isSpace(5760));
    ok(isSpace(8192));
    ok(isSpace(8193));
    ok(isSpace(8194));
    ok(isSpace(8195));
    ok(isSpace(8196));
    ok(isSpace(8197));
    ok(isSpace(8198));
    ok(isSpace(8199));
    ok(isSpace(8200));
    ok(isSpace(8201));
    ok(isSpace(8202));
    ok(isSpace(8232));
    ok(isSpace(8233));
    ok(isSpace(8239));
    ok(isSpace(8287));
    ok(isSpace(12288));
    ok(!isSpace(0));
    ok(!isSpace(127));
    ok(!isSpace(128));
    ok(!isSpace(255));
    ok(!isSpace(256));
    ok(!isSpace(-1));
    ok(!isSpace(-128));
    ok(!isSpace(-255));
    ok(!isSpace(-256));
    ok(!isSpace(Infinity));
    ok(!isSpace(-Infinity));
    ok(!isSpace(NaN));
    ok(!isSpace(0.1));
    ok(!isSpace(-0.1));
    ok(!isSpace(0.9));
    ok(!isSpace(-0.9));
    ok(!isSpace(1.1));
    ok(!isSpace(-1.1));
    ok(!isSpace(1.9));
    ok(!isSpace(-1.9));
    ok(!isSpace(1.0));
    ok(!isSpace(-1.0));
    ok(!isSpace(0.0));
    ok(!isSpace(-0.0));
    ok(!isSpace(0.0000000000001));
    ok(!isSpace(-0.0000000000001));
    ok(!isSpace(0.0000000000009));
    ok(!isSpace(-0.0000000000009));
    ok(!isSpace(0.0000000000011));
    ok(!isSpace(-0.0000000000011));
});

Deno.test("chars::isSpaceAt", () => {

    const str = "Holy 💩\n\t\f\r";
    ok(!isSpaceAt(str, 0));
    ok(!isSpaceAt(str, 1));
    ok(!isSpaceAt(str, 2));
    ok(!isSpaceAt(str, 3));
    ok(isSpaceAt(str, 4));
    ok(!isSpaceAt(str, 5));
    ok(isSpaceAt(str, 7));
    ok(isSpaceAt(str, 8));
    ok(isSpaceAt(str, 9));
    ok(isSpaceAt(str, 10));
})