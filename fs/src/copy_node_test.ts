// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
import {} from "../../.tasks/node_shim.ts";
import { assert, assertEquals, assertRejects, assertThrows } from "@std/assert";
import * as path from "@std/path";
import { copy, copySync } from "./copy.ts";
import { existsSync } from "./exists.ts";
import { ensureDir, ensureDirSync } from "./ensure_dir.ts";
import { ensureFile, ensureFileSync } from "./ensure_file.ts";
import { ensureSymlink, ensureSymlinkSync } from "./ensure_symlink.ts";
import {
    lstat,
    lstatSync,
    makeTempDir,
    makeTempDirSync,
    readFileSync,
    readTextFile,
    remove,
    removeSync,
    stat,
    statSync,
    writeFileSync,
    writeTextFile,
} from "./fs.ts";

const moduleDir = path.dirname(path.fromFileUrl(import.meta.url));
const testdataDir = path.resolve(moduleDir, "testdata");

function testCopy(
    name: string,
    cb: (tempDir: string) => Promise<void>,
    ignore = false,
) {
    Deno.test({
        name,
        async fn() {
            const tempDir = await makeTempDir({
                prefix: "deno_std_copy_async_test_",
            });
            await cb(tempDir);
            await remove(tempDir, { recursive: true });
        },
        ignore,
    });
}

function testCopySync(name: string, cb: (tempDir: string) => void) {
    Deno.test({
        name,
        fn: () => {
            const tempDir = makeTempDirSync({
                prefix: "deno_std_copy_sync_test_",
            });
            cb(tempDir);
            removeSync(tempDir, { recursive: true });
        },
    });
}

testCopy(
    "copy() rejects if src does not exist",
    async (tempDir: string) => {
        const srcFile = path.join(testdataDir, "copy_file_not_exists.txt");
        const destFile = path.join(tempDir, "copy_file_not_exists_1.txt");
        await assertRejects(
            async () => {
                await copy(srcFile, destFile);
            },
        );
    },
);

testCopy(
    "copy() rejects if src and dest are the same paths",
    async (tempDir: string) => {
        const srcFile = path.join(tempDir, "copy_file_same.txt");
        const destFile = path.join(tempDir, "copy_file_same.txt");
        await assertRejects(
            async () => {
                await copy(srcFile, destFile);
            },
            Error,
            "Source and destination cannot be the same.",
        );
    },
);

testCopy(
    "copy() copies file to new destination",
    async (tempDir: string) => {
        const srcFile = path.join(testdataDir, "copy_file.txt");
        const destFile = path.join(tempDir, "copy_file_copy.txt");

        const srcContent = await readTextFile(srcFile);

        assert(await lstat(srcFile), "source should exist before copy");
        await assertRejects(
            async () => await lstat(destFile),
            "destination should not exist before copy",
        );

        await copy(srcFile, destFile);

        assert(await lstat(srcFile), "source should exist after copy");
        assert(await lstat(destFile), "destination should exist after copy");

        const destContent = await readTextFile(destFile);

        assertEquals(
            srcContent,
            destContent,
            "source and destination should have the same content",
        );

        // Copy again and it should throw an error.
        await assertRejects(
            async () => {
                await copy(srcFile, destFile);
            },
            Error,
            `'${destFile}' already exists.`,
        );

        // Modify destination file.

        await writeTextFile(destFile, "txt copy");

        assertEquals(await readTextFile(destFile), "txt copy");

        // Copy again with overwrite option.
        await copy(srcFile, destFile, { overwrite: true });

        // Make sure the file has been overwritten.
        assertEquals(await readTextFile(destFile), "txt");
    },
);

testCopy(
    "copy() copies with preserve timestamps",
    async (tempDir: string) => {
        const srcFile = path.join(testdataDir, "copy_file.txt");
        const destFile = path.join(tempDir, "copy_file_copy.txt");

        const srcStatInfo = await stat(srcFile);

        assert(srcStatInfo.atime instanceof Date);
        assert(srcStatInfo.mtime instanceof Date);

        // Copy with overwrite and preserve timestamps options.
        await copy(srcFile, destFile, {
            overwrite: true,
            preserveTimestamps: true,
        });

        const destStatInfo = await stat(destFile);

        assert(destStatInfo.atime instanceof Date);
        assert(destStatInfo.mtime instanceof Date);
        assertEquals(destStatInfo.atime, srcStatInfo.atime);
        assertEquals(destStatInfo.mtime, srcStatInfo.mtime);
    },
);

testCopy(
    "copy() rejects if destination is its own subdirectory",
    async (tempDir: string) => {
        const srcDir = path.join(tempDir, "parent");
        const destDir = path.join(srcDir, "child");

        await ensureDir(srcDir);

        await assertRejects(
            async () => {
                await copy(srcDir, destDir);
            },
            Error,
            `Cannot copy '${srcDir}' to a subdirectory of itself, '${destDir}'.`,
        );
    },
);

testCopy(
    "copy() rejects when copying a directory to an existent destination that is not a directory",
    async (tempDir: string) => {
        const srcDir = path.join(tempDir, "parent");
        const destDir = path.join(tempDir, "child.txt");

        await ensureDir(srcDir);
        await ensureFile(destDir);

        await assertRejects(
            async () => {
                await copy(srcDir, destDir);
            },
            Error,
            `Cannot overwrite non-directory '${destDir}' with directory '${srcDir}'.`,
        );
    },
);

testCopy(
    "copy() copies a directory",
    async (tempDir: string) => {
        const srcDir = path.join(testdataDir, "copy_dir");
        const destDir = path.join(tempDir, "copy_dir");
        const srcFile = path.join(srcDir, "0.txt");
        const destFile = path.join(destDir, "0.txt");
        const srcNestFile = path.join(srcDir, "nest", "0.txt");
        const destNestFile = path.join(destDir, "nest", "0.txt");

        await copy(srcDir, destDir);

        assert(await lstat(destFile));
        assert(await lstat(destNestFile));

        // After copy. The source and destination should have the same content.
        assertEquals(
            await readTextFile(srcFile),
            await readTextFile(destFile),
        );
        assertEquals(
            await readTextFile(srcNestFile),
            await readTextFile(destNestFile),
        );

        // Copy again without overwrite option and it should throw an error.
        await assertRejects(
            async () => {
                await copy(srcDir, destDir);
            },
            Error,
            `'${destDir}' already exists.`,
        );

        // Modify the file in the destination directory.
        await writeTextFile(destNestFile, "nest copy");
        assertEquals(await readTextFile(destNestFile), "nest copy");

        // Copy again with overwrite option.
        await copy(srcDir, destDir, { overwrite: true });

        // Make sure the file has been overwritten.
        assertEquals(await readTextFile(destNestFile), "nest");
    },
);

testCopy(
    "copy() copies a symlink file",
    async (tempDir: string) => {
        const dir = path.join(testdataDir, "copy_dir_link_file");
        const srcLink = path.join(dir, "0.txt");
        const destLink = path.join(tempDir, "0_copy.txt");

        assert(
            (await lstat(srcLink)).isSymlink,
            `'${srcLink}' should be symlink type`,
        );

        await copy(srcLink, destLink);

        const statInfo = await lstat(destLink);

        assert(statInfo.isSymlink, `'${destLink}' should be symlink type`);
    },
);

testCopy(
    "copy() copies a symlink directory",
    async (tempDir: string) => {
        const srcDir = path.join(testdataDir, "copy_dir");
        const srcLink = path.join(tempDir, "copy_dir_link");
        const destLink = path.join(tempDir, "copy_dir_link_copy");

        await ensureSymlink(srcDir, srcLink);

        assert(
            (await lstat(srcLink)).isSymlink,
            `'${srcLink}' should be symlink type`,
        );

        await copy(srcLink, destLink);

        const statInfo = await lstat(destLink);

        assert(statInfo.isSymlink);
    },
);

testCopySync(
    "copySync() throws if src does not exist",
    (tempDir: string) => {
        const srcFile = path.join(testdataDir, "copy_file_not_exists_sync.txt");
        const destFile = path.join(tempDir, "copy_file_not_exists_1_sync.txt");
        assertThrows(() => {
            copySync(srcFile, destFile);
        });
    },
);

testCopySync(
    "copySync() copies with preserve timestamps",
    (tempDir: string) => {
        const srcFile = path.join(testdataDir, "copy_file.txt");
        const destFile = path.join(tempDir, "copy_file_copy.txt");

        const srcStatInfo = statSync(srcFile);

        assert(srcStatInfo.atime instanceof Date);
        assert(srcStatInfo.mtime instanceof Date);

        // Copy with overwrite and preserve timestamps options.
        copySync(srcFile, destFile, {
            overwrite: true,
            preserveTimestamps: true,
        });

        const destStatInfo = statSync(destFile);

        assert(destStatInfo.atime instanceof Date);
        assert(destStatInfo.mtime instanceof Date);
        assertEquals(destStatInfo.atime, srcStatInfo.atime);
        assertEquals(destStatInfo.mtime, srcStatInfo.mtime);
    },
);

testCopySync(
    "copySync() throws if src and dest are the same paths",
    () => {
        const srcFile = path.join(testdataDir, "copy_file_same_sync.txt");
        assertThrows(
            () => {
                copySync(srcFile, srcFile);
            },
            Error,
            "Source and destination cannot be the same.",
        );
    },
);

testCopySync("copySync() copies file to new destination", (tempDir: string) => {
    const srcFile = path.join(testdataDir, "copy_file.txt");
    const destFile = path.join(tempDir, "copy_file_copy_sync.txt");

    const srcContent = new TextDecoder().decode(readFileSync(srcFile));

    assertEquals(existsSync(srcFile), true);
    assertEquals(existsSync(destFile), false);

    copySync(srcFile, destFile);

    assertEquals(existsSync(srcFile), true);
    assertEquals(existsSync(destFile), true);

    const destContent = new TextDecoder().decode(readFileSync(destFile));

    assertEquals(srcContent, destContent);

    // Copy again without overwrite option and it should throw an error.
    assertThrows(
        () => {
            copySync(srcFile, destFile);
        },
        Error,
        `'${destFile}' already exists.`,
    );

    // Modify destination file.
    writeFileSync(destFile, new TextEncoder().encode("txt copy"));

    assertEquals(
        new TextDecoder().decode(readFileSync(destFile)),
        "txt copy",
    );

    // Copy again with overwrite option.
    copySync(srcFile, destFile, { overwrite: true });

    // Make sure the file has been overwritten.
    assertEquals(new TextDecoder().decode(readFileSync(destFile)), "txt");
});

testCopySync(
    "copySync() throws if destination is its own subdirectory",
    (tempDir: string) => {
        const srcDir = path.join(tempDir, "parent");
        const destDir = path.join(srcDir, "child");

        ensureDirSync(srcDir);

        assertThrows(
            () => {
                copySync(srcDir, destDir);
            },
            Error,
            `Cannot copy '${srcDir}' to a subdirectory of itself, '${destDir}'.`,
        );
    },
);

testCopySync(
    "copySync() throws when copying a directory to an existent destination that is not a directory",
    (tempDir: string) => {
        const srcDir = path.join(tempDir, "parent_sync");
        const destDir = path.join(tempDir, "child.txt");

        ensureDirSync(srcDir);
        ensureFileSync(destDir);

        assertThrows(
            () => {
                copySync(srcDir, destDir);
            },
            Error,
            `Cannot overwrite non-directory '${destDir}' with directory '${srcDir}'.`,
        );
    },
);

testCopySync("copySync() copies a directory", (tempDir: string) => {
    const srcDir = path.join(testdataDir, "copy_dir");
    const destDir = path.join(tempDir, "copy_dir_copy_sync");
    const srcFile = path.join(srcDir, "0.txt");
    const destFile = path.join(destDir, "0.txt");
    const srcNestFile = path.join(srcDir, "nest", "0.txt");
    const destNestFile = path.join(destDir, "nest", "0.txt");

    copySync(srcDir, destDir);

    assertEquals(existsSync(destFile), true);
    assertEquals(existsSync(destNestFile), true);

    // After copy. The source and destination should have the same content.
    assertEquals(
        new TextDecoder().decode(readFileSync(srcFile)),
        new TextDecoder().decode(readFileSync(destFile)),
    );
    assertEquals(
        new TextDecoder().decode(readFileSync(srcNestFile)),
        new TextDecoder().decode(readFileSync(destNestFile)),
    );

    // Copy again without overwrite option and it should throw an error.
    assertThrows(
        () => {
            copySync(srcDir, destDir);
        },
        Error,
        `'${destDir}' already exists.`,
    );

    // Modify the file in the destination directory.
    writeFileSync(destNestFile, new TextEncoder().encode("nest copy"));
    assertEquals(
        new TextDecoder().decode(readFileSync(destNestFile)),
        "nest copy",
    );

    // Copy again with overwrite option.
    copySync(srcDir, destDir, { overwrite: true });

    // Make sure the file has been overwritten.
    assertEquals(
        new TextDecoder().decode(readFileSync(destNestFile)),
        "nest",
    );
});

testCopySync(
    "copySync() copies symlink file",
    (tempDir: string) => {
        const dir = path.join(testdataDir, "copy_dir_link_file");
        const srcLink = path.join(dir, "0.txt");
        const destLink = path.join(tempDir, "0_copy.txt");

        assert(
            lstatSync(srcLink).isSymlink,
            `'${srcLink}' should be symlink type`,
        );

        copySync(srcLink, destLink);

        const statInfo = lstatSync(destLink);

        assert(statInfo.isSymlink, `'${destLink}' should be symlink type`);
    },
);

testCopySync(
    "copySync() copies symlink directory",
    (tempDir: string) => {
        const originDir = path.join(testdataDir, "copy_dir");
        const srcLink = path.join(tempDir, "copy_dir_link");
        const destLink = path.join(tempDir, "copy_dir_link_copy");

        ensureSymlinkSync(originDir, srcLink);

        assert(
            lstatSync(srcLink).isSymlink,
            `'${srcLink}' should be symlink type`,
        );

        copySync(srcLink, destLink);

        const statInfo = lstatSync(destLink);

        assert(statInfo.isSymlink);
    },
);
