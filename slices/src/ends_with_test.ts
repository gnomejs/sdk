import { equal } from "@std/assert";
import { endsWith, endsWithFold } from "./ends_with.ts";

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

Deno.test("slices::endsWith", () => {
    const tests = [
        { input: "hello world", test: "world", result: true },
        { input: "hello world", test: "world ", result: false },
        { input: "hello world", test: "WORLD", result: false },
        { input: "hello world", test: "WORLD ", result: false },
        { input: "hello WOrLD", test: "world", result: false },
        { input: "hello WÖrLD", test: "wörld", result: false },
        { input: "hello wörLD", test: "wörld", result: true },
    ];

    for (const { input, test, result } of tests) {
        const actual = endsWith(input, test);
        equal(actual, result);
    }
});
