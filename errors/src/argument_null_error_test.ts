import { equal, ok } from "@gnome/assert";
import { ArgumentNullError } from "./argument_null_error.ts";

const errorName = "ArgumentNullError";

Deno.test("errors::ArgumenNullError", () => {
    const x = new ArgumentNullError("arg1");
    ok(x instanceof Error);
    equal(x.message, "Argument arg1 must not be null.");
    equal(x.name, errorName);
    ok(x.stack);
    const info = x.toObject();
    equal(info.message, x.message);
    equal(info.name, x.argumentName);
    equal(info.code, errorName);
    equal(info.target, x.target);

    const y = new ArgumentNullError({ name: "arg1", message: "test", target: "target", link: "link", cause: x });

    equal(y.message, "test");
    equal(y.name, errorName);
    equal(y.argumentName, "arg1");
    equal(y.target, "target");
    equal(y.link, "link");
    equal(y.cause, x);
    ok(y.stack);

    const info2 = y.toObject();
    equal(info2.message, y.message);
    equal(info2.name, y.argumentName);
    equal(info2.code, errorName);
    equal(info2.target, y.target);
    equal(info2.link, y.link);
    equal(info2.innerError?.message, x.message);
});
