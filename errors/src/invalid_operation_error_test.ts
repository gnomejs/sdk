import { equal, ok } from "@gnome/assert";
import { InvalidOperationError } from "./invalid_operation_error.ts";

const errorName = "InvalidOperationError";

Deno.test("errors::InvalidOperationError", () => {
    const x = new InvalidOperationError();
    ok(x instanceof Error);
    equal(x.message, "Invalid operation.");
    equal(x.name, errorName);
    ok(x.stack);
    const info = x.toObject();
    equal(info.message, x.message);
    equal(info.code, errorName);
    equal(info.target, x.target);

    const y = new InvalidOperationError({ message: "test", target: "target", link: "link", cause: x });
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
