// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// TODO(axetroy): Add test for Windows once symlink is implemented for Windows.
import { assertEquals, assertRejects, assertThrows } from "@std/assert";
import * as path from "@std/path";
import { ensureLink, ensureLinkSync } from "./ensure-link.ts";
import {
    lstat,
    lstatSync,
    makeDir,
    makeDirSync,
    readFileSync,
    readTextFile,
    remove,
    removeSync,
    writeFile,
    writeFileSync,
    writeTextFile,
} from "./base.ts";

const moduleDir = path.dirname(path.fromFileUrl(import.meta.url));
const testdataDir = path.resolve(moduleDir, "testdata");

Deno.test("ensureLink() rejects if src and dest do not exist", async function () {
    const srcDir = path.join(testdataDir, "ensure_link_1");
    const destDir = path.join(testdataDir, "ensure_link_1_2");
    const testFile = path.join(srcDir, "test.txt");
    const linkFile = path.join(destDir, "link.txt");

    await assertRejects(
        async () => {
            await ensureLink(testFile, linkFile);
        },
    );

    await remove(destDir, { recursive: true });
});

Deno.test("ensureLinkSync() throws if src and dest do not exist", function () {
    const testDir = path.join(testdataDir, "ensure_link_2");
    const testFile = path.join(testDir, "test.txt");
    const linkFile = path.join(testDir, "link.txt");

    assertThrows(() => {
        ensureLinkSync(testFile, linkFile);
    });

    removeSync(testDir, { recursive: true });
});

Deno.test("ensureLink() ensures dest links to the src", async function () {
    const testDir = path.join(testdataDir, "ensure_link_3");
    const testFile = path.join(testDir, "test.txt");
    const linkFile = path.join(testDir, "link.txt");

    await Deno.mkdir(testDir, { recursive: true });
    await Deno.writeFile(testFile, new Uint8Array());

    await ensureLink(testFile, linkFile);

    const srcStat = await lstat(testFile);
    const linkStat = await lstat(linkFile);

    assertEquals(srcStat.isFile, true);
    assertEquals(linkStat.isFile, true);

    // har link success. try to change one of them. they should be change both.

    // let's change origin file.
    await writeTextFile(testFile, "123");

    const testFileContent1 = await readTextFile(testFile);
    const linkFileContent1 = await readTextFile(testFile);

    assertEquals(testFileContent1, "123");
    assertEquals(testFileContent1, linkFileContent1);

    // let's change link file.
    await writeFile(testFile, new TextEncoder().encode("abc"));

    const testFileContent2 = await readTextFile(testFile);
    const linkFileContent2 = await readTextFile(testFile);

    assertEquals(testFileContent2, "abc");
    assertEquals(testFileContent2, linkFileContent2);

    await remove(testDir, { recursive: true });
});

Deno.test("ensureLinkSync() ensures dest links to the src", function () {
    const testDir = path.join(testdataDir, "ensure_link_4");
    const testFile = path.join(testDir, "test.txt");
    const linkFile = path.join(testDir, "link.txt");

    makeDirSync(testDir, { recursive: true });
    writeFileSync(testFile, new Uint8Array());

    ensureLinkSync(testFile, linkFile);

    const srcStat = lstatSync(testFile);

    const linkStat = lstatSync(linkFile);

    assertEquals(srcStat.isFile, true);
    assertEquals(linkStat.isFile, true);

    // har link success. try to change one of them. they should be change both.

    // let's change origin file.
    writeFileSync(testFile, new TextEncoder().encode("123"));

    const testFileContent1 = new TextDecoder().decode(
        readFileSync(testFile),
    );
    const linkFileContent1 = new TextDecoder().decode(
        readFileSync(testFile),
    );

    assertEquals(testFileContent1, "123");
    assertEquals(testFileContent1, linkFileContent1);

    // let's change link file.
    writeFileSync(testFile, new TextEncoder().encode("abc"));

    const testFileContent2 = new TextDecoder().decode(
        readFileSync(testFile),
    );
    const linkFileContent2 = new TextDecoder().decode(
        readFileSync(testFile),
    );

    assertEquals(testFileContent2, "abc");
    assertEquals(testFileContent2, linkFileContent2);

    removeSync(testDir, { recursive: true });
});

Deno.test("ensureLink() rejects if link does not exist", async function () {
    const testDir = path.join(testdataDir, "ensure_link_origin_3");
    const linkDir = path.join(testdataDir, "ensure_link_link_3");
    const testFile = path.join(testDir, "test.txt");

    await makeDir(testDir, { recursive: true });
    await writeFile(testFile, new Uint8Array());

    await assertRejects(
        async () => {
            await ensureLink(testDir, linkDir);
        },
        // "Operation not permitted (os error 1)" // throw an local matching test
        // "Access is denied. (os error 5)" // throw in CI
    );

    await remove(testDir, { recursive: true });
});

Deno.test("ensureLinkSync() throws if link does not exist", function () {
    const testDir = path.join(testdataDir, "ensure_link_origin_3");
    const linkDir = path.join(testdataDir, "ensure_link_link_3");
    const testFile = path.join(testDir, "test.txt");

    makeDirSync(testDir, { recursive: true });
    writeFileSync(testFile, new Uint8Array());

    assertThrows(
        () => {
            ensureLinkSync(testDir, linkDir);
        },
        // "Operation not permitted (os error 1)" // throw an local matching test
        // "Access is denied. (os error 5)" // throw in CI
    );

    removeSync(testDir, { recursive: true });
});
