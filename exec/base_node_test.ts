import {} from "./node/shim.ts";
import {
    assert as ok,
    assertEquals as equals,
    assertFalse as no,
    assertNotEquals as notEquals,
    assertThrows,
    fail,
} from "@std/assert";
import { Command, ShellCommand } from "./base.ts";
import { WINDOWS } from "@gnome/os-constants";
import { which } from "./which.ts";
import { env } from "@gnome/env";
import type { ShellCommandOptions } from "./command.ts";
import { remove, writeTextFile } from "@gnome/fs";
import { dirname, fromFileUrl } from "@std/path";

const EOL = WINDOWS ? "\r\n" : "\n";

const echo = await which("echo");
const ls = await which("ls");

Deno.test("Command with simple output", async () => {
    if (WINDOWS) {
        const cmd = new Command("where.exe", ["deno.exe"]);
        const output = await cmd.output();
        equals(output.code, 0);
        ok(output.text().trim().endsWith("deno.exe"));
    } else {
        const cmd = new Command("which", ["deno"]);
        const output = await cmd.output();
        equals(output.code, 0);
        ok(output.text().trim().endsWith("deno"));
        equals(output.lines().length, 2);
    }
});

Deno.test({
    name: "Command with inherit returns no output",
    fn: async () => {
        const cmd = new Command("echo", ["hello"], { stdout: "inherit" });
        const output = await cmd.output();
        equals(output.code, 0);
        equals(output.stdout.length, 0);
        equals(output.text(), "");
    },
    ignore: !echo,
});

Deno.test({
    name: "Command with bad command returns error",
    fn: async () => {
        const cmd = new Command("git", ["clone"], { stderr: "piped", stdout: "piped" });
        const output = await cmd.output();
        ok(output.code !== 0);
        notEquals(output.stderr.length, 0);
        notEquals(output.errorText(), "");
    },
    ignore: !echo,
});

Deno.test({
    name: "Command that sets cwd",
    fn: async () => {
        const dir = dirname(fromFileUrl(import.meta.url));
        const cmd2 = new Command("ls", ["-l"], { cwd: dir });
        const output2 = await cmd2.output();
        equals(output2.code, 0);
        ok(output2.text().includes("base.ts"));

        const home = env.get("HOME") || env.get("USERPROFILE") || ".";
        const cmd = new Command("ls", ["-l"], { cwd: home });
        const output = await cmd.output();
        equals(output.code, 0);
        no(output.text().includes("base.ts"));
    },
    ignore: !ls,
});

Deno.test({
    name: "Command with spawn with default options",
    fn: async () => {
        const cmd = new Command("echo", ["hello"]);
        const process = await cmd.spawn();
        const output = await process.output();
        equals(output.code, 0);
        // should default to inherits
        equals(output.stdout.length, 0);
    },
});

Deno.test({
    name: "Command with spawn with piped options",
    fn: async () => {
        const cmd = new Command("echo", ["hello"], {
            stdout: "piped",
            stderr: "piped",
        });
        const process = await cmd.spawn();
        const output = await process.output();
        equals(output.code, 0);
        // should default to inherits
        equals(output.stdout.length, 6);
    },
    ignore: !echo,
});

Deno.test("Command as promise", async () => {
    const output = await new Command("echo", ["hello"]);
    equals(output.code, 0);
    equals(output.text(), "hello\n");
});

Deno.test("Command return text", async () => {
    const cmd = new Command("echo", ["hello"]);
    const output = await cmd.text();
    equals(output, "hello\n");
});

Deno.test("Command return lines", async () => {
    const cmd = new Command("echo", ["hello"]);
    const output = await cmd.lines();
    equals(output.length, 2);
    equals(output[0], "hello");
    equals(output[1], "");
});

Deno.test({
    name: "Command with pipe to invoke echo, grep, and cat",
    fn: async () => {
        const result = await new Command("echo", "my test")
            .pipe("grep", "test")
            .pipe("cat")
            .output();

        equals(result.code, 0);
        console.log(result.text());
    },
});

Deno.test("Command with json", async () => {
    const cmd = new Command("echo", ['{"hello": "world"}']);
    const output = await cmd.json() as Record<string, string>;
    equals(output.hello, "world");
});

Deno.test("Command with log", {ignore: echo === undefined }, async () => {
    let f: string = "";
    let args: string[] | undefined = [];

    const cmd = new Command("echo", ["hello"], {
        log: (file, a) => {
            f = file;
            args = a;
        },
    });
    const output = await cmd.output();
    equals(output.code, 0);
    ok(f.endsWith("echo"));
    ok(args !== undefined, "args is undefined");
    equals(args.length, 1);
});

Deno.test("Command use validate", async () => {
    const cmd = new Command("echo", ["hello"]);
    const output = await cmd.output();
    try {
        output.validate();
    } catch (_e) {
        fail("Should not throw");
    }

    const cmd2 = new Command("git", ["clone"], { stderr: "piped", stdout: "piped" });
    const output2 = await cmd2.output();
    assertThrows(() => output2.validate());
    try {
        output2.validate((_) => true);
    } catch (_e) {
        fail("Should not throw");
    }
});

class Pwsh extends ShellCommand {
    constructor(script: string, options?: ShellCommandOptions) {
        super("pwsh", script, options);
    }

    override get ext(): string {
        return ".ps1";
    }

    override getShellArgs(script: string, isFile: boolean): string[] {
        const params = this.shellArgs ?? ["-NoProfile", "-NonInteractive", "-NoLogo", "-ExecutionPolicy", "ByPass"];
        if (isFile) {
            params.push("-File", script);
        } else {
            params.push("-Command", script);
        }

        return params;
    }
}

Deno.test("ShellCommand - Get shell args", () => {
    const cmd = new Pwsh("hello.ps1");
    const args = cmd.getShellArgs("hello.ps1", true);
    equals(args.length, 7);
    equals(args[0], "-NoProfile");
    equals(args[1], "-NonInteractive");
    equals(args[2], "-NoLogo");
    equals(args[3], "-ExecutionPolicy");
    equals(args[4], "ByPass");
    equals(args[5], "-File");
});

Deno.test("ShellCommand - Get ext", () => {
    const cmd = new Pwsh("Write-Host 'Hello, World!'");
    const ext = cmd.ext;
    equals(ext, ".ps1");
});

Deno.test("ShellCommand with inline", async () => {
    const cmd = new Pwsh("Write-Host 'Hello, World!'");
    const output = await cmd.output();
    equals(output.code, 0);
    equals(output.text(), `Hello, World!${EOL}`);
});

Deno.test("ShellCommand with file", async () => {
    await writeTextFile("hello.ps1", "Write-Host 'Hello, World!'");
    const cmd = new Pwsh("hello.ps1");
    const output = await cmd.output();
    equals(output.code, 0);
    equals(output.text(), `Hello, World!${EOL}`);
    await remove("hello.ps1");
});

Deno.test("ShellCommand with spawn", async () => {
    await writeTextFile("hello2.ps1", "Write-Host 'Hello, World!'");
    const cmd = new Pwsh("hello2.ps1", { stdout: "piped", stderr: "piped" });
    await using process = cmd.spawn();

    const output = await process.output();
    equals(output.code, 0);
    equals(output.text(), `Hello, World!${EOL}`);
    await remove("hello2.ps1");
});
