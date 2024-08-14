import { equal, ok } from "@gnome/assert";
import { ArgumentRangeError } from "./argument_range_error.ts";

const errorName = "ArgumentRangeError";

Deno.test("errors::ArgumentRangeError", () => {
    const x = new ArgumentRangeError("arg1", 1);
    ok(x instanceof Error);
    equal(x.message, "Argument arg1 out of range.");
    equal(x.name, errorName);
    ok(x.stack);
    const info = x.toObject();
    equal(info.message, x.message);
    equal(info.name, x.argumentName);
    equal(info.code, errorName);
    equal(info.target, x.target);
    equal(x.value, 1);

    const y = new ArgumentRangeError({ name: "arg1", message: "test", target: "target", link: "link", cause: x });

    equal(y.message, "test");
    equal(y.name, errorName);
    equal(y.argumentName, "arg1");
    equal(y.target, "target");
    equal(y.link, "link");
    equal(y.cause, x);
    equal(y.value, undefined);
    ok(y.stack);

    const info2 = y.toObject();
    equal(info2.message, y.message);
    equal(info2.name, y.argumentName);
    equal(info2.code, errorName);
    equal(info2.target, y.target);
    equal(info2.link, y.link);
    equal(info2.innerError?.message, x.message);
});
