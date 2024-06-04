import { ArgumentError, collect, SystemError, TimeoutError } from "./mod.ts";
import { assert as ok, assertEquals as equals, assertInstanceOf } from "@std/assert";

Deno.test("SystemError", () => {
    const x = new SystemError("test");
    assertInstanceOf(x, Error);
    equals(x.message, "test");
    equals(x.name, "SystemError");
    ok(x.stack);
    equals(x.code, "SystemError");
    ok(x.stackTrace);
    ok(x.stackTrace.length > 0);

    ok(x.toObject());
});

Deno.test("TimeoutError", () => {
    const x = new TimeoutError("test");
    assertInstanceOf(x, Error);
    equals(x.message, "test");
    equals(x.name, "TimeoutError");
    ok(x.stack);
    equals(x.code, "TimeoutError");
    ok(x.stackTrace);
    ok(x.stackTrace.length > 0);

    ok(x.toObject());
});

Deno.test("ArgumentError", () => {
    const x = new ArgumentError("arg1");
    assertInstanceOf(x, Error);
    equals(x.message, "Argument arg1 is invalid.");
    equals(x.name, "ArgumentError");
    ok(x.stack);
    equals(x.code, "ArgumentError");
    ok(x.stackTrace);
    ok(x.stackTrace.length > 0);

    ok(x.toObject());
});

Deno.test("collectError", () => {
    const x = new Error("test");
    const y = new SystemError("test", x);
    const errors = collect(y);

    equals(errors.length, 2);
});
