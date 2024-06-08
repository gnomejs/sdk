import { assert as ok, assertEquals as equals, assertFalse as no } from "jsr:@std/assert@^0.224.0";
import { BROWSER, BUN, CLOUDFLARE, DENO, NODE, NODELIKE, RUNTIME } from "./mod.ts";
import { dirname, fromFileUrl } from "@std/path";

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

Deno.test("runtime", () => {
    equals(RUNTIME, "deno");
    no(BUN);
    no(NODE);
    no(BROWSER);
    no(CLOUDFLARE);
    no(NODELIKE);
    ok(DENO);
});

Deno.test("deno scenario", async () => {
    const cmd = new Deno.Command("deno", {
        args: ["run", "-A", `${_dir}/_load_platform.ts`],
        stdout: "piped",
        stderr: "piped",
    });

    const output = await cmd.output();
    const decoder = new TextDecoder();
    const text = decoder.decode(output.stdout);

    equals(text, "deno\n");
});

Deno.test("node scenario", { ignore: !hasNode }, async () => {
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

    equals(text, "node\n");
});

Deno.test("bun scenario", { ignore: !hasBun }, async () => {
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

    equals(text, "bun\n");
});
