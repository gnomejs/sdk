import { assert as ok, assertEquals as equals, assertFalse as no } from "jsr:@std/assert@^0.224.0";
import { ARCH, DARWIN, IS_64BIT, LINUX, PLATFORM, WINDOWS } from "./mod.ts";

Deno.test("platform", () => {
    switch (PLATFORM) {
        case "darwin":
            {
                ok(DARWIN);
                no(LINUX);
                no(WINDOWS);
                ok(IS_64BIT);
            }

            break;

        case "windows":
            {
                no(DARWIN);
                no(LINUX);
                ok(WINDOWS);
                ok(IS_64BIT);
            }
            break;

        case "linux":
            {
                no(DARWIN);
                ok(LINUX);
                no(WINDOWS);
                ok(IS_64BIT);
            }
            break;
    }
});

Deno.test("deno_scenario", async () => {
    const cmd = new Deno.Command("deno", {
        args: ["run", "-A", "./scenarios/load_platform.ts"],
        stdout: "piped",
        stderr: "piped",
    });

    const output = await cmd.output();
    const decoder = new TextDecoder();
    const text = decoder.decode(output.stdout);
    console.log(decoder.decode(output.stderr));

    equals(text, `${PLATFORM}_${ARCH}\n`);
});

Deno.test("scenario node", async () => {
    // tsx runs with node even though we're using bun to invoke

    const HOME = Deno.env.get("USERPROFILE") || Deno.env.get("HOME") || Deno.env.get("HOMEPATH") ||
        Deno.env.get("HOMEDRIVE");
    let exe = "bun";
    if (HOME) {
        try {
            using file = await Deno.open(`${HOME}/.bun/bin/bun`, { read: true });
            const fileInfo = await file.stat();
            if (fileInfo.isFile) {
                exe = `${HOME}/.bun/bin/bun`;
            }
        } catch (e) {
            console.warn(e);
        }
    }

    const cmd = new Deno.Command(exe, {
        args: ["tsx", "./scenarios/load_platform.ts"],
        stdout: "piped",
        stderr: "piped",
    });

    const output = await cmd.output();
    const decoder = new TextDecoder();
    const text = decoder.decode(output.stdout);
    console.log(decoder.decode(output.stderr));

    equals(text, `${PLATFORM}_${ARCH}\n`);
});

Deno.test("scenario bun", async () => {
    const cmd = new Deno.Command("bun", {
        args: ["./scenarios/load_platform.ts"],
        stdout: "piped",
        stderr: "piped",
    });

    const output = await cmd.output();
    const decoder = new TextDecoder();
    const text = decoder.decode(output.stdout);
    console.log(decoder.decode(output.stderr));

    equals(text, `${PLATFORM}_${ARCH}\n`);
});
