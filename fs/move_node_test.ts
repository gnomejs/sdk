// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
import {} from "./node/shim.ts";
import { assert, assertEquals, assertRejects, assertThrows } from "@std/assert";
import * as path from "@std/path";
import { SubdirectoryMoveError } from "./errors.ts";
import { move, moveSync } from "./move.ts";
import { ensureFile, ensureFileSync } from "./ensure-file.ts";
import { ensureDir, ensureDirSync } from "./ensure-dir.ts";
import { existsSync } from "./exists.ts";
import {
    lstat,
    lstatSync,
    makeDir,
    makeDirSync,
    readFileSync,
    readTextFile,
    readTextFileSync,
    remove,
    removeSync,
    writeFile,
    writeFileSync,
} from "./base.ts";

const moduleDir = path.dirname(path.fromFileUrl(import.meta.url));
const testdataDir = path.resolve(moduleDir, "testdata");

Deno.test("move() rejects if src dir does not exist", async function () {
    const srcDir = path.join(testdataDir, "move_test_src_1");
    const destDir = path.join(testdataDir, "move_test_dest_1");
    // if src directory not exist
    await assertRejects(
        async () => {
            await move(srcDir, destDir);
        },
    );
});

Deno.test("move() creates dest dir if it does not exist", async function () {
    const srcDir = path.join(testdataDir, "move_test_src_2");
    const destDir = path.join(testdataDir, "move_test_dest_2");

    await makeDir(srcDir, { recursive: true });

    try {
        // if dest directory not exist
        await assertRejects(
            async () => {
                await move(srcDir, destDir);
                throw new Error("should not throw error");
            },
            Error,
            "should not throw error",
        );
    } finally {
        await remove(destDir, { recursive: true });
    }
});

Deno.test(
    "move() creates dest dir if it does not exist and overwrite option is set to true",
    async function () {
        const srcDir = path.join(testdataDir, "move_test_src_2");
        const destDir = path.join(testdataDir, "move_test_dest_2");

        await makeDir(srcDir, { recursive: true });

        try {
            await assertRejects(
                async () => {
                    await move(srcDir, destDir, { overwrite: true });
                    throw new Error("should not throw error");
                },
                Error,
                "should not throw error",
            );
        } finally {
            await remove(destDir);
        }
        // if dest directory not exist
    },
);

Deno.test("move() rejects if src file does not exist", async function () {
    const srcFile = path.join(testdataDir, "move_test_src_3", "test.txt");
    const destFile = path.join(testdataDir, "move_test_dest_3", "test.txt");

    // if src directory not exist
    await assertRejects(
        async () => {
            await move(srcFile, destFile);
        },
    );
});

Deno.test("move() moves file and can overwrite content", async function () {
    const srcDir = path.join(testdataDir, "move_test_src_4");
    const destDir = path.join(testdataDir, "move_test_dest_4");
    const srcFile = path.join(srcDir, "test.txt");
    const destFile = path.join(destDir, "test.txt");
    const srcContent = new TextEncoder().encode("src");
    const destContent = new TextEncoder().encode("dest");

    // make sure files exists
    await Promise.all([ensureFile(srcFile), ensureFile(destFile)]);

    // write file content
    await Promise.all([
        writeFile(srcFile, srcContent),
        writeFile(destFile, destContent),
    ]);

    // make sure the test file have been created
    assertEquals(await readTextFile(srcFile), "src");
    assertEquals(await readTextFile(destFile), "dest");

    // move it without override
    await assertRejects(
        async () => {
            await move(srcFile, destFile);
        },
        Error,
        "dest already exists",
    );

    // move again with overwrite
    await assertRejects(
        async () => {
            await move(srcFile, destFile, { overwrite: true });
            throw new Error("should not throw error");
        },
        Error,
        "should not throw error",
    );

    await assertRejects(async () => await lstat(srcFile));
    assertEquals(await readTextFile(destFile), "src");

    // clean up
    await Promise.all([
        remove(srcDir, { recursive: true }),
        remove(destDir, { recursive: true }),
    ]);
});

Deno.test("move() moves dir", async function () {
    const srcDir = path.join(testdataDir, "move_test_src_5");
    const destDir = path.join(testdataDir, "move_test_dest_5");
    const srcFile = path.join(srcDir, "test.txt");
    const destFile = path.join(destDir, "test.txt");
    const srcContent = new TextEncoder().encode("src");

    await makeDir(srcDir, { recursive: true });
    assert(await lstat(srcDir));
    await writeFile(srcFile, srcContent);

    await move(srcDir, destDir);

    await assertRejects(async () => await lstat(srcDir));
    assert(await lstat(destDir));
    assert(await lstat(destFile));

    const destFileContent = await readTextFile(destFile);
    assertEquals(destFileContent, "src");

    await remove(destDir, { recursive: true });
});

Deno.test(
    "move() moves files if src and dest exist and can overwrite content",
    async function () {
        const srcDir = path.join(testdataDir, "move_test_src_6");
        const destDir = path.join(testdataDir, "move_test_dest_6");
        const srcFile = path.join(srcDir, "test.txt");
        const destFile = path.join(destDir, "test.txt");
        const srcContent = new TextEncoder().encode("src");
        const destContent = new TextEncoder().encode("dest");

        await Promise.all([
            makeDir(srcDir, { recursive: true }),
            makeDir(destDir, { recursive: true }),
        ]);
        assert(await lstat(srcDir));
        assert(await lstat(destDir));
        await Promise.all([
            writeFile(srcFile, srcContent),
            writeFile(destFile, destContent),
        ]);

        await move(srcDir, destDir, { overwrite: true });

        await assertRejects(async () => await lstat(srcDir));
        assert(await lstat(destDir));
        assert(await lstat(destFile));

        const destFileContent = await readTextFile(destFile);
        assertEquals(destFileContent, "src");

        await remove(destDir, { recursive: true });
    },
);

Deno.test("move() rejects when dest is its own sub dir", async function () {
    const srcDir = path.join(testdataDir, "move_test_src_7");
    const destDir = path.join(srcDir, "nest");

    await ensureDir(destDir);

    await assertRejects(
        async () => {
            await move(srcDir, destDir);
        },
        Error,
        `Cannot move '${srcDir}' to a subdirectory of itself, '${destDir}'.`,
    );
    await remove(srcDir, { recursive: true });
});

Deno.test("moveSync() throws if src dir does not exist", function () {
    const srcDir = path.join(testdataDir, "move_sync_test_src_1");
    const destDir = path.join(testdataDir, "move_sync_test_dest_1");
    // if src directory not exist
    assertThrows(() => {
        moveSync(srcDir, destDir);
    });
});

Deno.test("moveSync() creates dest dir if it does not exist", function () {
    const srcDir = path.join(testdataDir, "move_sync_test_src_2");
    const destDir = path.join(testdataDir, "move_sync_test_dest_2");

    makeDirSync(srcDir, { recursive: true });

    // if dest directory not exist
    assertThrows(
        () => {
            moveSync(srcDir, destDir);
            throw new Error("should not throw error");
        },
        Error,
        "should not throw error",
    );

    removeSync(destDir);
});

Deno.test("moveSync() creates dest dir if it does not exist and overwrite option is set to true", function () {
    const srcDir = path.join(testdataDir, "move_sync_test_src_2");
    const destDir = path.join(testdataDir, "move_sync_test_dest_2");

    makeDirSync(srcDir, { recursive: true });

    // if dest directory not exist width overwrite
    assertThrows(
        () => {
            moveSync(srcDir, destDir, { overwrite: true });
            throw new Error("should not throw error");
        },
        Error,
        "should not throw error",
    );

    removeSync(destDir);
});

Deno.test("moveSync() throws if src file does not exist", function () {
    const srcFile = path.join(testdataDir, "move_sync_test_src_3", "test.txt");
    const destFile = path.join(testdataDir, "move_sync_test_dest_3", "test.txt");

    // if src directory not exist
    assertThrows(() => {
        moveSync(srcFile, destFile);
    });
});

Deno.test("moveSync() moves file and can overwrite content", function () {
    const srcDir = path.join(testdataDir, "move_sync_test_src_4");
    const destDir = path.join(testdataDir, "move_sync_test_dest_4");
    const srcFile = path.join(srcDir, "test.txt");
    const destFile = path.join(destDir, "test.txt");
    const srcContent = new TextEncoder().encode("src");
    const destContent = new TextEncoder().encode("dest");

    // make sure files exists
    ensureFileSync(srcFile);
    ensureFileSync(destFile);

    // write file content
    writeFileSync(srcFile, srcContent);
    writeFileSync(destFile, destContent);

    // make sure the test file have been created
    assertEquals(new TextDecoder().decode(readFileSync(srcFile)), "src");
    assertEquals(new TextDecoder().decode(readFileSync(destFile)), "dest");

    // move it without override
    assertThrows(
        () => {
            moveSync(srcFile, destFile);
        },
        Error,
        "dest already exists",
    );

    // move again with overwrite
    assertThrows(
        () => {
            moveSync(srcFile, destFile, { overwrite: true });
            throw new Error("should not throw error");
        },
        Error,
        "should not throw error",
    );

    assertEquals(existsSync(srcFile), false);
    assertEquals(new TextDecoder().decode(Deno.readFileSync(destFile)), "src");

    // clean up
    Deno.removeSync(srcDir, { recursive: true });
    Deno.removeSync(destDir, { recursive: true });
});

Deno.test("moveSync() moves dir", function () {
    const srcDir = path.join(testdataDir, "move_sync_test_src_5");
    const destDir = path.join(testdataDir, "move_sync_test_dest_5");
    const srcFile = path.join(srcDir, "test.txt");
    const destFile = path.join(destDir, "test.txt");
    const srcContent = new TextEncoder().encode("src");

    makeDirSync(srcDir, { recursive: true });
    assertEquals(existsSync(srcDir), true);
    writeFileSync(srcFile, srcContent);

    moveSync(srcDir, destDir);

    assertEquals(existsSync(srcDir), false);
    assertEquals(existsSync(destDir), true);
    assertEquals(existsSync(destFile), true);

    const destFileContent = new TextDecoder().decode(readFileSync(destFile));
    assertEquals(destFileContent, "src");

    removeSync(destDir, { recursive: true });
});

Deno.test("moveSync() moves files if src and dest exist and can overwrite content", function () {
    const srcDir = path.join(testdataDir, "move_sync_test_src_6");
    const destDir = path.join(testdataDir, "move_sync_test_dest_6");
    const srcFile = path.join(srcDir, "test.txt");
    const destFile = path.join(destDir, "test.txt");
    const srcContent = new TextEncoder().encode("src");
    const destContent = new TextEncoder().encode("dest");

    makeDirSync(srcDir, { recursive: true });
    makeDirSync(destDir, { recursive: true });
    assertEquals(existsSync(srcDir), true);
    assertEquals(existsSync(destDir), true);
    writeFileSync(srcFile, srcContent);
    writeFileSync(destFile, destContent);

    moveSync(srcDir, destDir, { overwrite: true });

    assertEquals(existsSync(srcDir), false);
    assertEquals(existsSync(destDir), true);
    assertEquals(existsSync(destFile), true);

    const destFileContent = new TextDecoder().decode(readFileSync(destFile));
    assertEquals(destFileContent, "src");

    removeSync(destDir, { recursive: true });
});

Deno.test("moveSync() throws when dest is its own sub dir", function () {
    const srcDir = path.join(testdataDir, "move_sync_test_src_7");
    const destDir = path.join(srcDir, "nest");

    ensureDirSync(destDir);

    assertThrows(
        () => {
            moveSync(srcDir, destDir, { overwrite: true });
        },
        Error,
        `Cannot move '${srcDir}' to a subdirectory of itself, '${destDir}'.`,
    );
    removeSync(srcDir, { recursive: true });
});

Deno.test("move() accepts overwrite option set to true for file content", async function () {
    const dir = path.join(testdataDir, "move_same_file_1");
    const file = path.join(dir, "test.txt");
    const url = path.toFileUrl(file);
    const content = new TextEncoder().encode("test");

    // Make sure test file exists
    await ensureFile(file);
    await writeFile(file, content);
    assert(await lstat(dir));

    // Test varying pairs of `string` and `URL` params.
    const pairs = [
        [file, file],
        [file, url],
        [url, file],
        [url, url],
    ] as const;

    for (const p of pairs) {
        const src = p[0];
        const dest = p[1];

        await move(src, dest, { overwrite: true });
        assertEquals(await readTextFile(src), "test");
    }

    await remove(dir, { recursive: true });
});

Deno.test("move() accepts overwrite option set to true for directories", async function () {
    const dir = path.join(testdataDir, "move_same_dir_1");
    const url = path.toFileUrl(dir);

    // Make sure test dir exists
    await ensureDir(dir);
    assert(await lstat(dir));

    // Test varying pairs of `string` and `URL params.
    const pairs = [
        [dir, dir],
        [dir, url],
        [url, dir],
        [url, url],
    ] as const;

    for (const p of pairs) {
        const src = p[0];
        const dest = p[1];

        await assertRejects(async () => {
            await move(src, dest);
        }, SubdirectoryMoveError);
    }

    await remove(dir, { recursive: true });
});

Deno.test("moveSync() accepts overwrite option set to true for file content", function () {
    const dir = path.join(testdataDir, "move_sync_same_file_1");
    const file = path.join(dir, "test.txt");
    const url = path.toFileUrl(file);
    const content = new TextEncoder().encode("test");

    // Make sure test file exists
    ensureFileSync(file);
    writeFileSync(file, content);
    assert(lstatSync(dir));

    // Test varying pairs of `string` and `URL` params.
    const pairs = [
        [file, file],
        [file, url],
        [url, file],
        [url, url],
    ] as const;

    for (const p of pairs) {
        const src = p[0];
        const dest = p[1];

        moveSync(src, dest, { overwrite: true });
        assertEquals(readTextFileSync(src), "test");
    }

    removeSync(dir, { recursive: true });
});

Deno.test("move() accepts overwrite option set to true for directories", function () {
    const dir = path.join(testdataDir, "move_sync_same_dir_1");
    const url = path.toFileUrl(dir);

    // Make sure test dir exists
    ensureDirSync(dir);
    assert(lstatSync(dir));

    // Test varying pairs of `string` and `URL params.
    const pairs = [
        [dir, dir],
        [dir, url],
        [url, dir],
        [url, url],
    ] as const;

    for (const p of pairs) {
        const src = p[0];
        const dest = p[1];

        assertThrows(() => {
            moveSync(src, dest);
        }, SubdirectoryMoveError);
    }

    removeSync(dir, { recursive: true });
});
