import { equal } from "@gnome/assert";
import { camelize } from "./camelize.ts";
import { toCharSliceLike } from "./to_char_array.ts";

Deno.test("slices::camelize", () => {
    const tests = [
        ["hello_world", "HelloWorld"],
        ["hello-world", "HelloWorld"],
        ["hello world", "HelloWorld"],
        ["helloWorld", "Helloworld"],
        ["helloWorld123", "Helloworld123"],
        ["hello123World", "Hello123world"],
    ];

    for (const [input, expected] of tests) {
        const actual = String.fromCodePoint(...camelize(toCharSliceLike(input)));
        equal(actual, expected);
    }

    const test2 = [
        ["hello_world", "HelloWorld"],
        ["hello-world", "HelloWorld"],
        ["hello world", "HelloWorld"],
        ["helloWorld", "HelloWorld"],
        ["helloWorld123", "HelloWorld123"],
        ["hello123World", "Hello123World"],
    ];

    for (const [input, expected] of test2) {
        const actual = String.fromCodePoint(...camelize(toCharSliceLike(input), { preserveCase: true }));
        equal(actual, expected);
    }
});
