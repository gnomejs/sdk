import { assertEquals as equals } from "@std/assert";
import { open, remove } from "./base.ts";
import { ensureDir } from "./ensure-dir.ts";
import { dirname, fromFileUrl, join } from "@std/path";

const _dir = dirname(fromFileUrl(import.meta.url));

Deno.test("fs: open and read", async () => {
    await ensureDir(join(_dir, "testdata"));
    const filename = join(_dir, "testdata", "hello.txt");

    const file = await open(filename, { read: true });
    const buf = new Uint8Array(13);
    await file.read(buf);
    file.close();

    equals(new TextDecoder().decode(buf), "Hello, World!");
});

Deno.test("fs: open and write", async () => {
    const filename = join(_dir, "testdata", "hello_123.txt");
    try {
        let file = await open(filename, { write: true, createNew: true });
        await file.write(new TextEncoder().encode("Hello, World!"));
        file.close();

        file = await open(filename, { read: true });
        const buf = new Uint8Array(13);
        await file.read(buf);
        file.close();

        equals(new TextDecoder().decode(buf), "Hello, World!");
    } finally {
        await remove(filename);
    }
});
