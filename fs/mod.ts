/**
 * The fs module provides an file system API that works in deno,
 * bun, and nodejs to promote creating cross-runtime packages/modules
 * for TypeScript/JavaScript.
 *
 * The API takes heavy influence from Deno's file system APIs because
 * they are built on modern web standards and node was built when
 * promises, iterator, and async iterator did not exist.
 *
 * ## Basic Usage
 *
 * You can get documentation at [https://jsr.io/@gnome/fs](https://jsr.io/@gnome/fs)
 *
 * ```typescript
 * import { makeDir, writeTextFile, remove } from "@gnome/fs"
 *
 * await makeDir("/home/my_user/test");
 * await writeTextFile("/home/my_user/test/log.txt",  "ello");
 * await remove("/home/my_user/test", { recursive: true });
 *
 * ```
 *
 * ## TODO
 *
 * - [ ] Implement open and openSync
 * - [ ] Implement create and createSync
 *
 * ## License
 *
 * Most of the code from deno's std library which is under the MIT license
 * except for the modifications required to enable testing and abstractions
 * for deno and node.
 *
 * [MIT License](./LICENSE.md)
 * @module
 */

export * from "./base.ts";
export * from "./constants.ts";
export * from "./copy.ts";
export * from "./empty-dir.ts";
export * from "./ensure-dir.ts";
export * from "./ensure-file.ts";
export * from "./ensure-link.ts";
export * from "./ensure-symlink.ts";
export * from "./errors.ts";
export * from "./move.ts";
export * from "./walk.ts";
export * from "./expand-glob.ts";
