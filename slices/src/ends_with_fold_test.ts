import { equal } from "@std/assert";
import { endsWithFold } from "./ends_with_fold.ts";

Deno.test("slices::endsWithFold", () => {
    const tests = [
        { input: "hello world", test: "world", result: true },
        { input: "hello world", test: "world ", result: false },
        { input: "hello world", test: "WORLD", result: true },
        { input: "hello world", test: "WORLD ", result: false },
        { input: "hello WOrLD", test: "world", result: true },
        { input: "hello WÖrLD", test: "wörld", result: true },
    ];

    for (const { input, test, result } of tests) {
        const actual = endsWithFold(input, test);
        equal(actual, result);
    }
});
