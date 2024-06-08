// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
import { writeFileSync } from "./node/mod.ts";
import { assert, assertEquals, assertStringIncludes } from "@std/assert";
import * as path from "@std/path";
import { exists, existsSync } from "./exists.ts";
import { chmod, chmodSync, makeTempDir, makeTempDirSync, remove, removeSync, symlink, symlinkSync } from "./base.ts";
import { WINDOWS } from "./constants.ts";
import { writeFile } from "./node/mod.ts";

Deno.test("exists() returns false for a non-existent path", async function () {
    const tempDirPath = await makeTempDir();
    try {
        assertEquals(await exists(path.join(tempDirPath, "not_exists")), false);
    } finally {
        await remove(tempDirPath, { recursive: true });
    }
});

Deno.test("existsSync() returns false for a non-existent path", function () {
    const tempDirPath = makeTempDirSync();
    try {
        assertEquals(existsSync(path.join(tempDirPath, "not_exists")), false);
    } finally {
        removeSync(tempDirPath, { recursive: true });
    }
});

Deno.test("exists() returns true for an existing file", async function () {
    const tempDirPath = await makeTempDir();
    const tempFilePath = path.join(tempDirPath, "0.ts");
    writeFile(tempFilePath, new Uint8Array());
    try {
        assertEquals(await exists(tempFilePath), true);
        assertEquals(await exists(tempFilePath, {}), true);
        assertEquals(
            await exists(tempFilePath, {
                isDirectory: true,
            }),
            false,
        );
        assertEquals(
            await exists(tempFilePath, {
                isFile: true,
            }),
            true,
        );
        if (!WINDOWS) {
            // TODO(martin-braun): include mode check for Windows tests when chmod is ported to NT
            await chmod(tempFilePath, 0o000);
            assertEquals(
                await exists(tempFilePath, {
                    isReadable: true,
                }),
                false,
            );
        }
    } finally {
        if (!WINDOWS) {
            await chmod(tempFilePath, 0o644);
        }
        await remove(tempDirPath, { recursive: true });
    }
});

Deno.test("exists() returns true for an existing file symlink", async function () {
    const tempDirPath = await makeTempDir();
    const tempFilePath = path.join(tempDirPath, "0.ts");
    const tempLinkFilePath = path.join(tempDirPath, "0-link.ts");
    writeFile(tempFilePath, new Uint8Array());
    try {
        await symlink(tempFilePath, tempLinkFilePath);
        assertEquals(await exists(tempLinkFilePath), true);
        assertEquals(await exists(tempLinkFilePath, {}), true);
        assertEquals(
            await exists(tempLinkFilePath, {
                isDirectory: true,
            }),
            false,
        );
        assertEquals(
            await exists(tempLinkFilePath, {
                isFile: true,
            }),
            true,
        );
        if (!WINDOWS) {
            // TODO(martin-braun): include mode check for Windows tests when chmod is ported to NT
            await chmod(tempFilePath, 0o000);
            assertEquals(
                await exists(tempLinkFilePath, {
                    isReadable: true,
                }),
                false,
            );
            // TODO(martin-braun): test unreadable link when Rust's nix::sys::stat::fchmodat has been implemented
        }
    } finally {
        if (!WINDOWS) {
            await chmod(tempFilePath, 0o644);
        }
        await remove(tempDirPath, { recursive: true });
    }
});

Deno.test("existsSync() returns true for an existing file", function () {
    const tempDirPath = makeTempDirSync();
    const tempFilePath = path.join(tempDirPath, "0.ts");
    writeFileSync(tempFilePath, new Uint8Array());
    try {
        assertEquals(existsSync(tempFilePath), true);
        assertEquals(existsSync(tempFilePath, {}), true);
        assertEquals(
            existsSync(tempFilePath, {
                isDirectory: true,
            }),
            false,
        );
        assertEquals(
            existsSync(tempFilePath, {
                isFile: true,
            }),
            true,
        );
        if (!WINDOWS) {
            // TODO(martin-braun): include mode check for Windows tests when chmod is ported to NT
            chmodSync(tempFilePath, 0o000);
            assertEquals(
                existsSync(tempFilePath, {
                    isReadable: true,
                }),
                false,
            );
        }
    } finally {
        if (!WINDOWS) {
            chmodSync(tempFilePath, 0o644);
        }
        removeSync(tempDirPath, { recursive: true });
    }
});

Deno.test("existsSync() returns true for an existing file symlink", function () {
    const tempDirPath = makeTempDirSync();
    const tempFilePath = path.join(tempDirPath, "0.ts");
    const tempLinkFilePath = path.join(tempDirPath, "0-link.ts");
    writeFileSync(tempFilePath, new Uint8Array());
    try {
        symlinkSync(tempFilePath, tempLinkFilePath);
        assertEquals(existsSync(tempLinkFilePath), true);
        assertEquals(existsSync(tempLinkFilePath, {}), true);
        assertEquals(
            existsSync(tempLinkFilePath, {
                isDirectory: true,
            }),
            false,
        );
        assertEquals(
            existsSync(tempLinkFilePath, {
                isFile: true,
            }),
            true,
        );
        if (!WINDOWS) {
            // TODO(martin-braun): include mode check for Windows tests when chmod is ported to NT
            chmodSync(tempFilePath, 0o000);
            assertEquals(
                existsSync(tempLinkFilePath, {
                    isReadable: true,
                }),
                false,
            );
            // TODO(martin-braun): test unreadable link when Rust's nix::sys::stat::fchmodat has been implemented
        }
    } finally {
        if (!WINDOWS) {
            chmodSync(tempFilePath, 0o644);
        }
        removeSync(tempDirPath, { recursive: true });
    }
});

Deno.test("exists() returns true for an existing dir", async function () {
    const tempDirPath = await makeTempDir();
    try {
        assertEquals(await exists(tempDirPath), true);
        assertEquals(await exists(tempDirPath, {}), true);
        assertEquals(
            await exists(tempDirPath, {
                isDirectory: true,
            }),
            true,
        );
        assertEquals(
            await exists(tempDirPath, {
                isFile: true,
            }),
            false,
        );
        if (!WINDOWS) {
            // TODO(martin-braun): include mode check for Windows tests when chmod is ported to NT
            await chmod(tempDirPath, 0o000);
            assertEquals(
                await exists(tempDirPath, {
                    isReadable: true,
                }),
                false,
            );
        }
    } finally {
        if (!WINDOWS) {
            await chmod(tempDirPath, 0o755);
        }
        await remove(tempDirPath, { recursive: true });
    }
});

Deno.test("exists() returns true for an existing dir symlink", async function () {
    const tempDirPath = await makeTempDir();
    const tempLinkDirPath = path.join(tempDirPath, "temp-link");
    try {
        await symlink(tempDirPath, tempLinkDirPath);
        assertEquals(await exists(tempLinkDirPath), true);
        assertEquals(await exists(tempLinkDirPath, {}), true);
        assertEquals(
            await exists(tempLinkDirPath, {
                isDirectory: true,
            }),
            true,
        );
        assertEquals(
            await exists(tempLinkDirPath, {
                isFile: true,
            }),
            false,
        );
        if (!WINDOWS) {
            // TODO(martin-braun): include mode check for Windows tests when chmod is ported to NT
            await chmod(tempDirPath, 0o000);
            assertEquals(
                await exists(tempLinkDirPath, {
                    isReadable: true,
                }),
                false,
            );
            // TODO(martin-braun): test unreadable link when Rust's nix::sys::stat::fchmodat has been implemented
        }
    } finally {
        if (!WINDOWS) {
            await chmod(tempDirPath, 0o755);
        }
        await remove(tempDirPath, { recursive: true });
    }
});

Deno.test("existsSync() returns true for an existing dir", function () {
    const tempDirPath = makeTempDirSync();
    try {
        assertEquals(existsSync(tempDirPath), true);
        assertEquals(existsSync(tempDirPath, {}), true);
        assertEquals(
            existsSync(tempDirPath, {
                isDirectory: true,
            }),
            true,
        );
        assertEquals(
            existsSync(tempDirPath, {
                isFile: true,
            }),
            false,
        );
        if (!WINDOWS) {
            // TODO(martin-braun): include mode check for Windows tests when chmod is ported to NT
            chmodSync(tempDirPath, 0o000);
            assertEquals(
                existsSync(tempDirPath, {
                    isReadable: true,
                }),
                false,
            );
        }
    } finally {
        if (!WINDOWS) {
            chmodSync(tempDirPath, 0o755);
        }
        removeSync(tempDirPath, { recursive: true });
    }
});

Deno.test("existsSync() returns true for an existing dir symlink", function () {
    const tempDirPath = makeTempDirSync();
    const tempLinkDirPath = path.join(tempDirPath, "temp-link");
    try {
        symlinkSync(tempDirPath, tempLinkDirPath);
        assertEquals(existsSync(tempLinkDirPath), true);
        assertEquals(existsSync(tempLinkDirPath, {}), true);
        assertEquals(
            existsSync(tempLinkDirPath, {
                isDirectory: true,
            }),
            true,
        );
        assertEquals(
            existsSync(tempLinkDirPath, {
                isFile: true,
            }),
            false,
        );
        if (!WINDOWS) {
            // TODO(martin-braun): include mode check for Windows tests when chmod is ported to NT
            chmodSync(tempDirPath, 0o000);
            assertEquals(
                existsSync(tempLinkDirPath, {
                    isReadable: true,
                }),
                false,
            );
            // TODO(martin-braun): test unreadable link when Rust's nix::sys::stat::fchmodat has been implemented
        }
    } finally {
        if (!WINDOWS) {
            chmodSync(tempDirPath, 0o755);
        }
        removeSync(tempDirPath, { recursive: true });
    }
});

Deno.test("exists() returns false when both isDirectory and isFile sets true", async function () {
    const tempDirPath = await makeTempDir();
    try {
        assertEquals(
            await exists(tempDirPath, {
                isDirectory: true,
                isFile: true,
            }),
            true,
        );
    } catch (error) {
        assert(error instanceof TypeError);
        assertStringIncludes(
            error.message,
            "ExistsOptions.options.isDirectory and ExistsOptions.options.isFile must not be true together.",
        );
    } finally {
        await remove(tempDirPath, { recursive: true });
    }
});

Deno.test("existsSync() returns false when both isDirectory and isFile sets true", async function () {
    const tempDirPath = await makeTempDir();
    try {
        assertEquals(
            await existsSync(tempDirPath, {
                isDirectory: true,
                isFile: true,
            }),
            true,
        );
    } catch (error) {
        assert(error instanceof TypeError);
        assertStringIncludes(
            error.message,
            "ExistsOptions.options.isDirectory and ExistsOptions.options.isFile must not be true together.",
        );
    } finally {
        await remove(tempDirPath, { recursive: true });
    }
});
