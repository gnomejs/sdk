import { equal, ok } from "@gnome/assert";
import { StackTrace } from "./stacktrace.ts";

Deno.test("errors::StackTrace", () => {
    const stack1 = `Error: test1
    at test1 (file:///home/dev_user/projects/gnomejs/sdk/errors/src/test.ts:3:11)
    at test (file:///home/dev_user/projects/gnomejs/sdk/errors/src/test.ts:14:5)
    at file:///home/dev_user/projects/gnomejs/sdk/errors/src/test.ts:18:5
`;

    const trace = StackTrace.fromTrace(stack1);
    ok(trace);
    equal(trace.length, 3);
    console.log(trace.at(0));
    console.log(trace.at(2));
    equal(trace.at(0).functionName, "test1");
    equal(trace.at(0).fileName, "file:///home/dev_user/projects/gnomejs/sdk/errors/src/test.ts");
    equal(trace.at(0).lineNumber, 3);
    equal(trace.at(0).columnNumber, 11);
});
