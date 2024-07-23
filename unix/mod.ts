/**
 * ## Overview
 *
 * The unix module provides some of the methods from libc in Deno and Bun
 * using Foreign Function Interfaces.
 *
 * The methods return a result object from [@gnome/optional](https://jsr.io/@gnome/optional/doc/~/Result)
 * to help deal with exceptions loading the library or invoking
 * the Foreign Function Interfaces.
 *
 * The following libc methods are implemented:
 *
 * - getpwuid_r
 * - getpid
 * - getppid
 * - getuid
 * - geteuid
 * - getgid
 * - getegid
 * - gethostname
 * - getgroups
 * - getgrgid_r
 *
 * Each function that maps to a libc FFI call will open and close the library.
 * If you want to open the library, make multiple calls and then close it,
 * then use the `openLibc` function.
 *
 * ## Basic Usage
 *
 * ```typescript
 * import { openLibc, getUserName, getUserId, getHostName } from "@gnome/unix";
 *
 * // expect will return a value or throw with the provided message.
 * const uid = getUserId().expect("Failed to get user id");
 * const username = getUserName(uid).expect("Failed to get username");
 * console.log(username);
 *
 * let hn = "";
 * cosnt r0 = getHostName();
 * r0.inspect(o => console.log(o));
 *
 * using lib = openLibc();
 * lib.getProcessId().inspect(o => console.log(o));
 *
 * // gets the user's  entries from the /etc/passwd file.
 * lib.getPasswordEntry(uid).inspect(o => console.log(o));
 *
 * ```
 *
 * [MIT License](./LICENSE.md)
 */
import { err, type Result } from "@gnome/optional";
import type { GrEnt, LibcLibrary, PwEnt } from "./types.ts";
import { NotSupportedError } from "@gnome/errors/not-supported-error";
// deno-lint-ignore no-explicit-any
const g = globalThis as any;

let open = function (): Result<LibcLibrary> {
    return err<LibcLibrary>(new NotSupportedError("JavaScript runtime is not supported"));
};

if (typeof g.Deno !== "undefined") {
    const { openLibc } = await import("./deno.ts");
    open = openLibc;
} else if (typeof g.Bun !== "undefined") {
    const { openLibc } = await import("./bun.ts");
    open = openLibc;
}

export function getUserId(): Result<number> {
    const r = open();
    if (r.isError) {
        return err<number>(r.unwrapError());
    }

    using libc = r.unwrap();
    return libc.getUserId();
}

export function getEffectiveUserId(): Result<number> {
    const r = open();
    if (r.isError) {
        return err<number>(r.unwrapError());
    }

    using libc = r.unwrap();
    return libc.getEffectiveUserId();
}

export function getHostname(): Result<string> {
    const r = open();
    if (r.isError) {
        return err<string>(r.unwrapError());
    }

    using libc = r.unwrap();
    return libc.getHostName();
}

export function getUserName(uid: number): Result<string> {
    const r = open();
    if (r.isError) {
        return err<string>(r.unwrapError());
    }

    using libc = r.unwrap();
    return libc.getUserName(uid);
}

export function getGroupName(gid: number): Result<string> {
    const r = open();
    if (r.isError) {
        return err<string>(r.unwrapError());
    }

    using libc = r.unwrap();
    return libc.getGroupName(gid);
}

export function getProcessId(): Result<number> {
    const r = open();
    if (r.isError) {
        return err<number>(r.unwrapError());
    }

    using libc = r.unwrap();
    return libc.getProcessId();
}

export function getParentProcessId(): Result<number> {
    const r = open();
    if (r.isError) {
        return err<number>(r.unwrapError());
    }

    using libc = r.unwrap();
    return libc.getParentProcessId();
}

export function getGroupIds(): Result<Uint32Array> {
    const r = open();
    if (r.isError) {
        return err<Uint32Array>(r.unwrapError());
    }

    using libc = r.unwrap();
    return libc.getGroupIds();
}

export function getPasswordEntry(uid: number): Result<PwEnt> {
    const r = open();
    if (r.isError) {
        return err<PwEnt>(r.unwrapError());
    }

    using libc = r.unwrap();
    return libc.getPasswordEntry(uid);
}

export function getGroupEntry(gid: number): Result<GrEnt> {
    const r = open();
    if (r.isError) {
        return err<GrEnt>(r.unwrapError());
    }

    using libc = r.unwrap();
    return libc.getGroupEntry(gid);
}

export { open as openLibc };
