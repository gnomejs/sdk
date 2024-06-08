import { assert as ok, assertEquals as equals, assertFalse as no } from "@std/assert";
import { dirname, fromFileUrl } from "@std/path";
import { ARCH, DARWIN, IS_64BIT, LINUX, PLATFORM, WINDOWS } from "./mod.ts";

const _dir = dirname(fromFileUrl(import.meta.url));
async function which(exe: string): Promise<boolean> {
    const whichWhich = Deno.build.os === "windows" ? "where.exe" : "which";

    const whichCmd = new Deno.Command(whichWhich, { args: [exe] });
    const whichOutput = await whichCmd.output();
    if (whichOutput.code !== 0) {
        return false;
    }

    const text = new TextDecoder().decode(whichOutput.stdout);
    return text.trim().includes(exe);
}

const home = Deno.env.get("USERPROFILE") || Deno.env.get("HOME") || Deno.env.get("HOMEPATH") ||
    Deno.env.get("HOMEDRIVE");
const e = Deno.build.os === "windows" ? ".exe" : "";
const c = Deno.build.os === "windows" ? ".cmd" : "";
const hasNode = await which("node");
const hasBun = await which("bun") || await Deno.stat(`${home}/.bun/bin/bun${e}`).then(() => true).catch(() => false);

Deno.test("os-constants: platform", () => {
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

Deno.test("os-constants: node", { ignore: !hasNode }, async () => {
    // tsx runs with node even though we're using bun to invoke
    await Deno.copyFile(`${_dir}/mod.ts`, `${_dir}/test/node/mod.ts`);
    const r = await new Deno.Command(`npm${c}`, {
        args: ["install"],
        stderr: "inherit",
        stdout: "inherit",
        cwd: `${_dir}/test/node`,
    }).output();

    ok(r.code === 0, "npm install failed");

    const cmd = new Deno.Command("node", {
        args: [`${_dir}/test/node/node_modules/.bin/tsx`, `${_dir}/test/node/load_platform.ts`],
        stdout: "piped",
        stderr: "piped",
    });

    const output = await cmd.output();

    const decoder = new TextDecoder();
    const text = decoder.decode(output.stdout);
    console.log(decoder.decode(output.stderr));
    console.log(decoder.decode(output.stderr));
    ok(output.code === 0, "node failed to run tsx");

    equals(text, `${PLATFORM}_${ARCH}\n`);
});

Deno.test("os-constants: scenario bun", { ignore: !hasBun }, async () => {
    await Deno.copyFile(`${_dir}/mod.ts`, `${_dir}/test/bun/mod.ts`);
    await new Deno.Command("bun", {
        args: [`install`],
        stdout: "inherit",
        stderr: "inherit",
        cwd: `${_dir}/test/bun`,
    }).output();

    const cmd = new Deno.Command("bun", {
        args: [`${_dir}/test/bun/load_platform.ts`],
        stdout: "piped",
        stderr: "piped",
    });

    const output = await cmd.output();
    const decoder = new TextDecoder();
    const text = decoder.decode(output.stdout);
    console.log(decoder.decode(output.stderr));
    console.log(decoder.decode(output.stderr));

    equals(text, `${PLATFORM}_${ARCH}\n`);
});
