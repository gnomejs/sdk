import { splat, type SplatOptions } from "./splat.ts";
import { assertEquals as equals } from "jsr:@std/assert@0.225.0";

Deno.test("splat", () => {
    const args = splat({
        "version": true,
        splat: {
            prefix: "--",
        } as SplatOptions,
    });

    equals(args.length, 1);
    equals(args[0], "--version");
});

Deno.test("splat with assign", () => {
    const args = splat({
        "foo": "bar",
        splat: {
            assign: "=",
        } as SplatOptions,
    });

    equals(args.length, 1);
    equals(args[0], "--foo=bar");
});

Deno.test("splat with preserveCase", () => {
    const args = splat({
        "fooBar": "baz",
        splat: {
            preserveCase: true,
        } as SplatOptions,
    });

    equals(args.length, 2);
    equals(args[0], "--fooBar");
    equals(args[1], "baz");
});

Deno.test("splat with shortFlag", () => {
    const args = splat({
        "f": "bar",
        splat: {
            shortFlag: true,
        } as SplatOptions,
    });

    equals(args.length, 2);
    equals(args[0], "-f");
    equals(args[1], "bar");
});

Deno.test("splat with shortFlag and prefix", () => {
    const args = splat({
        "f": "bar",
        splat: {
            shortFlag: true,
        } as SplatOptions,
    });

    equals(args.length, 2);
    equals(args[0], "-f");
    equals(args[1], "bar");
});

Deno.test("splat with boolean short flag", () => {
    const args = splat({
        "f": true,
        splat: {
            shortFlag: true,
        } as SplatOptions,
    });

    equals(args.length, 1);
    equals(args[0], "-f");
});

Deno.test("splat with command", () => {
    const args = splat({
        "foo": "bar",
        splat: {
            command: ["git", "clone"],
        } as SplatOptions,
    });

    console.log(args);
    equals(args.length, 4);
    equals(args[0], "git");
    equals(args[1], "clone");
    equals(args[2], "--foo");
    equals(args[3], "bar");
});

Deno.test("splat with arguments", () => {
    const args = splat({
        "foo": "bar",
        splat: {
            arguments: ["foo"],
        } as SplatOptions,
    });

    equals(args.length, 1);
    equals(args[0], "bar");
});

Deno.test("splat with appended arguments", () => {
    const args = splat({
        "foo": "bar",
        "test": "baz",
        splat: {
            arguments: ["foo"],
            appendArguments: true,
        } as SplatOptions,
    });

    equals(args.length, 3);
    equals(args[0], "--test");
    equals(args[1], "baz");
    equals(args[2], "bar");
});

Deno.test("splat: noFlags", () => {
    const args = splat({
        "force": true,
        "other": true,
        splat: {
            noFlags: ["force"],
        } as SplatOptions
    })

    equals(args.length, 3);
    equals(args[0], "--force");
    equals(args[1], "true");
    equals(args[2], "--other");
});

Deno.test("splat: noFlagsValues", () => {
    const args = splat({
        "force": false,
        "other": true,
        splat: {
            noFlags: ["force"],
            noFlagValues: {t: "1", f: "2"}
        } as SplatOptions
    })

    equals(args.length, 3);
    equals(args[0], "--force");
    equals(args[1], "2");
    equals(args[2], "--other");
});
