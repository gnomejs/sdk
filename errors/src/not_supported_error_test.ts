import { equal, ok } from "@gnome/assert";
import { NotSupportedError } from "./not_supported_error.ts";

const errorName = "NotSupportedError";

Deno.test("errors:: NotSupportedError", () => {
    const x = new NotSupportedError();
    ok(x instanceof Error);
    equal(x.message, "Not supported.");
    equal(x.name, errorName);
    ok(x.stack);
    const info = x.toObject();
    equal(info.message, x.message);
    equal(info.code, errorName);
    equal(info.target, x.target);

    const y = new NotSupportedError({ message: "test", target: "target", link: "link", cause: x });
    equal(y.message, "test");
    equal(y.name, errorName);
    equal(y.target, "target");
    equal(y.link, "link");
    equal(y.cause, x);
    ok(y.stack);

    const info2 = y.toObject();
    equal(info2.message, y.message);
    equal(info2.code, errorName);
    equal(info2.target, y.target);
    equal(info2.link, y.link);
    equal(info2.innerError?.message, x.message);
});