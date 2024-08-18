import { fail, stringIncludes } from "@gnome/assert";
import { dirname, fromFileUrl } from "@std/path";

const dir = dirname(fromFileUrl(import.meta.url));

Deno.test("process::deno", async () => {
    const cmd = new Deno.Command("deno", {
        args: ["run", "-A", "./script.ts"],
        cwd: `${dir}/../test/deno`,
    });

    const { code, stdout } = await cmd.output();
    if (code !== 0) {
        fail("deno run failed");
    }

    const out = new TextDecoder().decode(stdout);
    stringIncludes(out, "stdout.write");
    stringIncludes(out, "stdout.writeSync");
    stringIncludes(out, "stdout.is_term:false"); // output is redirected.
    stringIncludes(out, "stdin.read null");
    stringIncludes(out, "stdin.readSync null");
});

Deno.test("process::node", async () => {
    let cmd = new Deno.Command("tsx", {
        args: ["--version"],
    });

    const r = await cmd.output();
    const code = r.code;
    if (code !== 0) {
        console.warn("tsx is not installed. Skipping test.");
    } else {
        cmd = new Deno.Command("npm", {
            args: ["install"],
            cwd: `${dir}/../test/node`,
        });

        let { code } = await cmd.output();
        if (code !== 0) {
            fail("npm install failed");
        }

        cmd = new Deno.Command("tsx", {
            args: ["./script.ts"],
            cwd: `${dir}/../test/node`,
        });

        const r = await cmd.output();
        code = r.code;
        const { stdout } = r;
        const out = new TextDecoder().decode(stdout);
        stringIncludes(out, "stdout.write");
        stringIncludes(out, "stdout.writeSync");
        stringIncludes(out, "stdout.is_term:false"); // output is redirected.
        stringIncludes(out, "stdin.read null"); // input is redirected.
        stringIncludes(out, "stdin.readSync null"); // input is redirected.
    }
});
