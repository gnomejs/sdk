import { equal, ok } from "@gnome/assert";
import { NullReferenceError } from "./null_reference_error.ts";

const errorName = "NullReferenceError";

Deno.test("errors:: NullReferenceError", () => {
    const x = new NullReferenceError();
    ok(x instanceof Error);
    equal(x.message, "Null reference found.");
    equal(x.name, errorName);
    ok(x.stack);
    const info = x.toObject();
    equal(info.message, x.message);
    equal(info.code, errorName);
    equal(info.target, x.target);

    const y = new NullReferenceError({ message: "test", target: "target", link: "link", cause: x });
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
