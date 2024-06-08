// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
import {} from "./node/shim.ts";
import { assertRejects, assertThrows } from "@std/assert";
import * as path from "@std/path";
import { ensureFile, ensureFileSync } from "./ensure-file.ts";
import { makeDir, makeDirSync, remove, removeSync, stat, statSync, writeFile, writeFileSync } from "./base.ts";

const moduleDir = path.dirname(path.fromFileUrl(import.meta.url));
const testdataDir = path.resolve(moduleDir, "testdata");

Deno.test("ensureFile() creates file if it does not exist", async function () {
    const testDir = path.join(testdataDir, "ensure_file_1");
    const testFile = path.join(testDir, "test.txt");

    try {
        await ensureFile(testFile);

        // test file should exists.
        await stat(testFile);
    } catch (e) {
        console.log(e);
    } finally {
        await remove(testDir, { recursive: true });
    }
});

Deno.test("ensureFileSync() creates file if it does not exist", function () {
    const testDir = path.join(testdataDir, "ensure_file_2");
    const testFile = path.join(testDir, "test.txt");

    try {
        ensureFileSync(testFile);

        // test file should exists.
        statSync(testFile);
    } finally {
        removeSync(testDir, { recursive: true });
    }
});

Deno.test("ensureFile() ensures existing file exists", async function () {
    const testDir = path.join(testdataDir, "ensure_file_3");
    const testFile = path.join(testDir, "test.txt");

    try {
        await makeDir(testDir, { recursive: true });
        await writeFile(testFile, new Uint8Array());

        await ensureFile(testFile);

        // test file should exists.
        await stat(testFile);
    } finally {
        await remove(testDir, { recursive: true });
    }
});

Deno.test("ensureFileSync() ensures existing file exists", function () {
    const testDir = path.join(testdataDir, "ensure_file_4");
    const testFile = path.join(testDir, "test.txt");

    try {
        makeDirSync(testDir, { recursive: true });
        writeFileSync(testFile, new Uint8Array());

        ensureFileSync(testFile);

        // test file should exists.
        statSync(testFile);
    } finally {
        removeSync(testDir, { recursive: true });
    }
});

Deno.test("ensureFile() rejects if input is dir", async function () {
    const testDir = path.join(testdataDir, "ensure_file_5");

    try {
        await makeDir(testDir, { recursive: true });

        await assertRejects(
            async () => {
                await ensureFile(testDir);
            },
            Error,
            `Ensure path exists, expected 'file', got 'dir'`,
        );
    } finally {
        await remove(testDir, { recursive: true });
    }
});

Deno.test("ensureFileSync() throws if input is dir", function () {
    const testDir = path.join(testdataDir, "ensure_file_6");

    try {
        makeDirSync(testDir, { recursive: true });

        assertThrows(
            () => {
                ensureFileSync(testDir);
            },
            Error,
            `Ensure path exists, expected 'file', got 'dir'`,
        );
    } finally {
        removeSync(testDir, { recursive: true });
    }
});
