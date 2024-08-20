import { DARWIN,  WINDOWS } from "@gnome/runtime-info/os";
import { MissingSymbolError, fromCString } from "@gnome/ffi";
import { NotSupportedError } from "@gnome/errors/not-supported-error";
import { ENAMETOOLONG, ERANGE, UnixError } from "../errno.ts";
import { type Result, ok, err } from "@gnome/monads/result"
import type { PwEnt, GrEnt } from "./structs.ts";

const libc = Deno.dlopen(DARWIN ? "libSystem.dylib" : "libc.so.6", {
    getpwuid_r: {
        parameters: ["u32", "pointer", "pointer", "u32", "pointer"],
        result: "i32",
        optional: true,
    },
    getpid: {
        parameters: [],
        result: "i32",
        optional: true,
    },
    getppid: {
        parameters: [],
        result: "i32",
        optional: true,
    },
    getuid: {
        parameters: [],
        result: "u32",
        optional: true,
    },
    geteuid: {
        parameters: [],
        result: "u32",
        optional: true,
    },
    getgid: {
        parameters: [],
        result: "u32",
        optional: true,
    },
    getegid: {
        parameters: [],
        result: "u32",
        optional: true,
    },
    gethostname: {
        parameters: ["buffer", "i32"],
        result: "i32",
        optional: true,
    },
    getgroups: {
        parameters: ["i32", "buffer"],
        result: "i32",
        optional: true,
    },
    getgrgid_r: {
        parameters: ["u32", "pointer", "pointer", "u32", "pointer"],
        result: "i32",
        optional: true,
    },
    strerror_r: {
        parameters: ["i32", "buffer", "i32"],
        result: "i32",
        optional: true,
    },
})

/**
 * Get the hostname of the system.
 * @returns The hostname of the system.
 * @throws {NotSupportedError} Thrown if the method is not supported on the current platform.
 * @throws {MissingSymbolError} Thrown if the required symbol is not available in the libc library.
 * @throws {UnixError} Thrown if an error occurs while getting the hostname.
 */
export function hostname(): string {
    if (WINDOWS) {
        throw new NotSupportedError("gethostname not implemented on Windows");
    }

    if (libc.symbols.gethostname === undefined || libc.symbols.gethostname === null) {
        throw new MissingSymbolError("gethostname", "libc");
    }

    let ret = ENAMETOOLONG as number;
    let bufLength = 64;
    while (ret === ENAMETOOLONG) {
        const buf = new Uint8Array(bufLength);
        ret = libc.symbols.gethostname(buf, bufLength);

        if (ret === 0) {
            return fromCString(buf);
        }

        if (ret !== ENAMETOOLONG) {
            throw new UnixError(ret, "Failed to get hostname");
        }

        bufLength *= 2;
    }

    throw new UnixError(ret, "Failed to get hostname");
}

/**
 * Get the hostname of the system as a result object.
 * @returns The hostname of the system as a result object.
 */
export function hostnameResult(): Result<string> {
    if (WINDOWS) {
        return err<string>(new NotSupportedError("gethostname not implemented on Windows"));
    }

    if (libc.symbols.gethostname === undefined || libc.symbols.gethostname === null) {
        return err<string>(new MissingSymbolError("gethostname", "libc"));
    }

    let ret = ENAMETOOLONG as number;
    let bufLength = 64;
    while (ret === ENAMETOOLONG) {
        const buf = new Uint8Array(bufLength);
        try {
            ret = libc.symbols.gethostname(buf, bufLength);
        } catch (e) {
            return err<string>(e as Error);
        }

        if (ret === 0) {
            return ok(fromCString(buf));
        }

        if (ret !== ENAMETOOLONG) {
            return err<string>(new UnixError(ret, "Failed to get hostname"));
        }

        bufLength *= 2;
    }

    return err<string>(new UnixError(ret, "Failed to get hostname"));
}

/**
 * Get the user id of the current process.
 * @returns The user id of the current process.
 * @throws {NotSupportedError} Thrown if the method is not supported on the current platform.
 * @throws {MissingSymbolError} Thrown if the required symbol is not available in the libc library.
 * @throws {UnixError} Thrown if an error occurs while getting the user id.
 */
export function uid(): number {
    if (WINDOWS) {
        throw new NotSupportedError("getuid not implemented on Windows");
    }

    if (libc.symbols.getuid === undefined || libc.symbols.getuid === null) {
        throw new MissingSymbolError("getuid", "libc");
    }

    return libc.symbols.getuid();
}

/**
 * Get the user id of the current process as a result object.
 * @returns The user id of the current process as a result object.
 */
export function uidResult(): Result<number> {
    if (WINDOWS) {
        return err<number>(new NotSupportedError("getuid not implemented on Windows"));
    }

    if (libc.symbols.getuid === undefined || libc.symbols.getuid === null) {
        return err<number>(new MissingSymbolError("getuid", "libc"));
    }

    try {
        return ok(libc.symbols.getuid());
    } catch (e) {
        return err<number>(e as Error);
    }
}

/**
 * Get the effective user id of the current process.
 * @returns The effective user id of the current process.
 * @throws {NotSupportedError} Thrown if the method is not supported on the current platform.
 * @throws {MissingSymbolError} Thrown if the required symbol is not available in the libc library.
 * @throws {UnixError} Thrown if an error occurs while getting the effective user id.
 */
export function euid(): number {
    if (WINDOWS) {
        throw new NotSupportedError("geteuid not implemented on Windows");
    }

    if (libc.symbols.geteuid === undefined || libc.symbols.geteuid === null) {
        throw new MissingSymbolError("geteuid", "libc");
    }

    return libc.symbols.geteuid();
}

/**
 * Get the effective user id of the current process as a result object.
 * @returns The effective user id of the current process as a result object.
 */
export function euidResult(): Result<number> {
    if (WINDOWS) {
        return err<number>(new NotSupportedError("geteuid not implemented on Windows"));
    }

    if (libc.symbols.geteuid === undefined || libc.symbols.geteuid === null) {
        return err<number>(new MissingSymbolError("geteuid", "libc"));
    }

    try {
        return ok(libc.symbols.geteuid());
    } catch (e) {
        return err<number>(e as Error);
    }
}

/**
 * Get the group id of the current process.
 * @returns The group id of the current process.
 * @throws {NotSupportedError} Thrown if the method is not supported on the current platform.
 * @throws {MissingSymbolError} Thrown if the required symbol is not available in the libc library.
 * @throws {UnixError} Thrown if an error occurs while getting the group id.
 */
export function gid(): number {
    if (WINDOWS) {
        throw new NotSupportedError("getgid not implemented on Windows");
    }

    if (libc.symbols.getgid === undefined || libc.symbols.getgid === null) {
        throw new MissingSymbolError("getgid", "libc");
    }

    return libc.symbols.getgid();
}

/**
 * Get the group id of the current process as a result object.
 * @returns The group id of the current process as a result object.
 */
export function gidResult(): Result<number> {
    if (WINDOWS) {
        return err<number>(new NotSupportedError("getgid not implemented on Windows"));
    }

    if (libc.symbols.getgid === undefined || libc.symbols.getgid === null) {
        return err<number>(new MissingSymbolError("getgid", "libc"));
    }

    try {
        return ok(libc.symbols.getgid());
    } catch (e) {
        return err<number>(e as Error);
    }
}

/**
 * Get the effective group id of the current process.
 * @returns The effective group id of the current process.
 * @throws {NotSupportedError} Thrown if the method is not supported on the current platform.
 * @throws {MissingSymbolError} Thrown if the required symbol is not available in the libc library.
 * @throws {UnixError} Thrown if an error occurs while getting the effective group id.
 */
export function egid(): number {
    if (WINDOWS) {
        throw new NotSupportedError("getegid not implemented on Windows");
    }

    if (libc.symbols.getegid === undefined || libc.symbols.getegid === null) {
        throw new MissingSymbolError("getegid", "libc");
    }

    return libc.symbols.getegid();
}

/**
 * Get the effective group id of the current process as a result object.
 * @returns The effective group id of the current process as a result object.
 */
export function egidResult(): Result<number> {
    if (WINDOWS) {
        return err<number>(new NotSupportedError("getegid not implemented on Windows"));
    }

    if (libc.symbols.getegid === undefined || libc.symbols.getegid === null) {
        return err<number>(new MissingSymbolError("getegid", "libc"));
    }

    try {
        return ok(libc.symbols.getegid());
    } catch (e) {
        return err<number>(e as Error);
    }
}

/**
 * Get the group ids of the current process.
 * @returns The group ids of the current process.
 * @throws {NotSupportedError} Thrown if the method is not supported on the current platform.
 * @throws {MissingSymbolError} Thrown if the required symbol is not available in the libc library.
 * @throws {UnixError} Thrown if an error occurs while getting the group ids.
 */
export function groups(): Uint32Array {
    if (WINDOWS) {
        throw new NotSupportedError("getgroups not implemented on Windows");
    }

    if (libc.symbols.getgroups === undefined || libc.symbols.getgroups === null) {
        throw new MissingSymbolError("getgroups", "libc");
    }

    const buf = new Uint32Array(1024);
    const ret = libc.symbols.getgroups(1024, buf);

    if (ret === -1) {
        throw new UnixError(ret, "Failed to get groups ids");
    }

    return buf.slice(0, ret);
}

/**
 * Get the group ids of the current process as a result object.
 * @returns The group ids of the current process as a result object.
 */
export function groupsResult(): Result<Uint32Array> {
    if (WINDOWS) {
        return err<Uint32Array>(new NotSupportedError("getgroups not implemented on Windows"));
    }

    if (libc.symbols.getgroups === undefined || libc.symbols.getgroups === null) {
        return err<Uint32Array>(new MissingSymbolError("getgroups", "libc"));
    }

    const buf = new Uint32Array(1024);
    let ret = 0;
    try {
        ret = libc.symbols.getgroups(1024, buf);
    } catch (e) {
        return err<Uint32Array>(e as Error);
    }

    if (ret === -1) {
        return err<Uint32Array>(new UnixError(ret, "Failed to get groups ids"));
    }

    const groups = buf.slice(0, ret);
    return ok(groups);
}

/**
 * Get the process id of the current process.
 * @returns The process id of the current process.
 * @throws {NotSupportedError} Thrown if the method is not supported on the current platform.
 * @throws {MissingSymbolError} Thrown if the required symbol is not available in the libc library.
 * @throws {UnixError} Thrown if an error occurs while getting the process id.
 */
export function pid(): number {
    if (WINDOWS) {
        throw new NotSupportedError("getpid not implemented on Windows");
    }

    if (libc.symbols.getpid === undefined || libc.symbols.getpid === null) {
        throw new MissingSymbolError("getpid", "libc");
    }

    return libc.symbols.getpid();
}

/**
 * Get the process id of the current process as a result object.
 * @returns The process id of the current process as a result object.
 */
export function pidResult(): Result<number> {
    if (WINDOWS) {
        return err<number>(new NotSupportedError("getpid not implemented on Windows"));
    }

    if (libc.symbols.getpid === undefined || libc.symbols.getpid === null) {
        return err<number>(new MissingSymbolError("getpid", "libc"));
    }

    try {
        return ok(libc.symbols.getpid());
    } catch (e) {
        return err<number>(e as Error);
    }
}

/**
 * Get the parent process id of the current process.
 * @returns The parent process id of the current process.
 * @throws {NotSupportedError} Thrown if the method is not supported on the current platform.
 * @throws {MissingSymbolError} Thrown if the required symbol is not available in the libc library.
 * @throws {UnixError} Thrown if an error occurs while getting the parent process id.
 */
export function ppid(): number {
    if (WINDOWS) {
        throw new NotSupportedError("getppid not implemented on Windows");
    }

    if (libc.symbols.getppid === undefined || libc.symbols.getppid === null) {
        throw new MissingSymbolError("getppid", "libc");
    }

    return libc.symbols.getppid();
}

/**
 * Get the parent process id of the current process as a result object.
 * @returns The parent process id of the current process as a result object.
 */
export function ppidResult(): Result<number> {
    if (WINDOWS) {
        return err<number>(new NotSupportedError("getppid not implemented on Windows"));
    }

    if (libc.symbols.getppid === undefined || libc.symbols.getppid === null) {
        return err<number>(new MissingSymbolError("getppid", "libc"));
    }

    try {
        return ok(libc.symbols.getppid());
    } catch (e) {
        return err<number>(e as Error);
    }
}

/**
 * Get the group name for the provided group id.
 * @param gid The group id to get the group name for.
 * @returns The group name for the provided group id.
 * @throws {NotSupportedError} Thrown if the method is not supported on the current platform.
 * @throws {MissingSymbolError} Thrown if the required symbol is not available in the libc library.
 * @throws {UnixError} Thrown if an error occurs while getting the group name.
 */
export function groupname(gid: number): string {
    if (WINDOWS) {
        throw new NotSupportedError("getgrgid_r not implemented on Windows");
    }

    if (libc.symbols.getgrgid_r === undefined || libc.symbols.getgrgid_r === null) {
        throw new MissingSymbolError("getgrgid_r", "libc");
    }

    let ret = ERANGE as number;
    let bufLength = 120;
    while (ret === ERANGE) {
        const buf = new Uint8Array(bufLength);
        const grpBuf = new Uint8Array(bufLength);
        const resultBuf = new Uint8Array(bufLength);
        const bufPtr = Deno.UnsafePointer.of(buf);
        const grpBufPtr = Deno.UnsafePointer.of(grpBuf);
        const resultBufPtr = Deno.UnsafePointer.of(resultBuf);

        ret = libc.symbols.getgrgid_r(gid, grpBufPtr, bufPtr, bufLength, resultBufPtr);

        if (ret === ERANGE) {
            bufLength *= 2;
            continue;
        }

        if (ret === 0) {
            return fromCString(buf);
        }

        throw new UnixError(ret, "Failed to get group name");
    }

    throw new UnixError(ret, "Failed to get group name");
}

/**
 * Get the group name for the provided group id as a result object.
 * @param gid The group id to get the group name for.
 * @returns The group name for the provided group id as a result object.
 */
export function groupnameResult(gid: number): Result<string> {
    if (WINDOWS) {
        return err<string>(new NotSupportedError("getgrgid_r not implemented on Windows"));
    }

    if (libc.symbols.getgrgid_r === undefined || libc.symbols.getgrgid_r === null) {
        return err<string>(new MissingSymbolError("getgrgid_r", "libc"));
    }

    let ret = ERANGE as number;
    let bufLength = 120;
    while (ret === ERANGE) {
        const buf = new Uint8Array(bufLength);
        const grpBuf = new Uint8Array(bufLength);
        const resultBuf = new Uint8Array(bufLength);
        const bufPtr = Deno.UnsafePointer.of(buf);
        const grpBufPtr = Deno.UnsafePointer.of(grpBuf);
        const resultBufPtr = Deno.UnsafePointer.of(resultBuf);

        try {
            ret = libc.symbols.getgrgid_r(gid, grpBufPtr, bufPtr, bufLength, resultBufPtr);
        } catch (e) {
            return err<string>(e as Error);
        }

        if (ret === ERANGE) {
            bufLength *= 2;
            continue;
        }

        if (ret === 0) {
            return ok(fromCString(buf));
        }

        return err<string>(new UnixError(ret, "Failed to get group name"));
    }

    return err<string>(new UnixError(ret, "Failed to get group name"));
}

/**
 * Get the group entry for the provided group id.
 * @param uid The user id to get the user name for.
 * @returns The user name for the provided user id.
 * @throws {NotSupportedError} Thrown if the method is not supported on the current platform.
 * @throws {MissingSymbolError} Thrown if the required symbol is not available in the libc library.
 * @throws {UnixError} Thrown if an error occurs while getting the user name.
 */
export function username(uid: number): string {
    if (WINDOWS) {
        throw new NotSupportedError("getpwuid_r not implemented on Windows");
    }

    if (libc.symbols.getpwuid_r === undefined || libc.symbols.getpwuid_r === null) {
        throw new MissingSymbolError("getpwuid_r", "libc");
    }

    let ret = ERANGE as number;
    let bufLength = 120;

    while (ret === ERANGE) {
        const buf = new Uint8Array(bufLength);
        const pwdBuf = new Uint8Array(bufLength);
        const resultBuf = new Uint8Array(bufLength);
        const bufPtr = Deno.UnsafePointer.of(buf);
        const pwdBufPtr = Deno.UnsafePointer.of(pwdBuf);
        const resultBufPtr = Deno.UnsafePointer.of(resultBuf);

        ret = libc.symbols.getpwuid_r(uid, pwdBufPtr, bufPtr, bufLength, resultBufPtr);

        if (ret === ERANGE) {
            bufLength *= 2;
            continue;
        }

        if (ret === 0) {
            return fromCString(buf);
        }

        throw new UnixError(ret, "Failed to get user name");
    }

    throw new UnixError(ret, "Failed to get user name");
}

/**
 * Get the user name for the provided user id as a result object.
 * @param uid The user id to get the user name for.
 * @returns The user name for the provided user id as a result object.
 */
export function usernameResult(uid: number): Result<string> {
    if (WINDOWS) {
        return err<string>(new NotSupportedError("getpwuid_r not implemented on Windows"));
    }

    if (libc.symbols.getpwuid_r === undefined || libc.symbols.getpwuid_r === null) {
        return err<string>(new MissingSymbolError("getpwuid_r", "libc"));
    }

    let ret = ERANGE as number;
    let bufLength = 120;

    while (ret === ERANGE) {
        const buf = new Uint8Array(bufLength);
        const pwdBuf = new Uint8Array(bufLength);
        const resultBuf = new Uint8Array(bufLength);
        const bufPtr = Deno.UnsafePointer.of(buf);
        const pwdBufPtr = Deno.UnsafePointer.of(pwdBuf);
        const resultBufPtr = Deno.UnsafePointer.of(resultBuf);

        try {
            ret = libc.symbols.getpwuid_r(uid, pwdBufPtr, bufPtr, bufLength, resultBufPtr);
        } catch (e) {
            return err<string>(e as Error);
        }

        if (ret === ERANGE) {
            bufLength *= 2;
            continue;
        }

        if (ret === 0) {
            return ok(fromCString(buf));
        }

        return err<string>(new UnixError(ret, "Failed to get user name"));
    }

    return err<string>(new UnixError(ret, "Failed to get user name"));
}
/**
 * Get the group entry for the provided group id.
 * @param uid The user id to get the password entry for.
 * @returns The password entry for the provided user id.
 * @throws {NotSupportedError} Thrown if the method is not supported on the current platform.
 * @throws {MissingSymbolError} Thrown if the required symbol is not available in the libc library.
 * @throws {UnixError} Thrown if an error occurs while getting the password entry.
 */
export function passwdEntry(uid: number): PwEnt {
    if (WINDOWS) {
        throw new NotSupportedError("getpwuid_r not implemented on Windows");
    }

    if (libc.symbols.getpwuid_r === undefined || libc.symbols.getpwuid_r === null) {
        throw new MissingSymbolError("getpwuid_r", "libc");
    }

    let ret = ERANGE;
    let bufLength = 512;
    while (ret === ERANGE) {
        const buf = new Uint8Array(bufLength);
        const pwdBuf = new Uint8Array(bufLength);
        const resultBuf = new Uint8Array(bufLength);
        const bufPtr = Deno.UnsafePointer.of(buf);
        const pwdBufPtr = Deno.UnsafePointer.of(pwdBuf);
        const resultBufPtr = Deno.UnsafePointer.of(resultBuf);

        ret = libc.symbols.getpwuid_r(uid, pwdBufPtr, bufPtr, bufLength, resultBufPtr);

        if (ret === ERANGE) {
            bufLength *= 2;
            continue;
        }

        if (ret === 0) {
            const v = new Deno.UnsafePointerView(pwdBufPtr as unknown as Deno.PointerObject<unknown>);
            const nameId = v.getBigInt64(0);
            const namePtr = Deno.UnsafePointer.create(nameId);
            const name = Deno.UnsafePointerView.getCString(namePtr as Deno.PointerObject);
            const pwId = v.getBigInt64(8);
            const pwPtr = Deno.UnsafePointer.create(pwId);
            const pw = Deno.UnsafePointerView.getCString(pwPtr as Deno.PointerObject);
            const uid = v.getInt32(16);
            const gid = v.getInt32(20);
            const gecosId = v.getBigInt64(24);
            const gecosPtr = Deno.UnsafePointer.create(gecosId);
            const gecos = gecosPtr === null
                ? ""
                : Deno.UnsafePointerView.getCString(gecosPtr as Deno.PointerObject);
            const dirId = v.getBigInt64(32);
            const dirPtr = Deno.UnsafePointer.create(dirId);
            const dir = Deno.UnsafePointerView.getCString(dirPtr as Deno.PointerObject);
            const shellId = v.getBigInt64(40);
            const shellPtr = Deno.UnsafePointer.create(shellId);
            const shell = Deno.UnsafePointerView.getCString(shellPtr as Deno.PointerObject);

            const result = {
                name: name,
                passwd: pw,
                uid: uid,
                gid: gid,
                gecos: gecos,
                dir: dir,
                shell: shell,
            } as PwEnt;

            return result;
        }

        throw new UnixError(ret, "Failed to get password entry");
    }

    throw new UnixError(ret, "Failed to get password entry");
}

/**
 * Get the password entry for the provided user id as a result object.
 * @param uid The user id to get the password entry for.
 * @returns The password entry for the provided user id as a result object.
 */
export function passwdEntryResult(uid: number): Result<PwEnt> {
    if (WINDOWS) {
        return err<PwEnt>(new NotSupportedError("getpwuid_r not implemented on Windows"));
    }

    if (libc.symbols.getpwuid_r === undefined || libc.symbols.getpwuid_r === null) {
        return err<PwEnt>(new MissingSymbolError("getpwuid_r", "libc"));
    }

    let ret = ERANGE;
    let bufLength = 512;
    while (ret === ERANGE) {
        const buf = new Uint8Array(bufLength);
        const pwdBuf = new Uint8Array(bufLength);
        const resultBuf = new Uint8Array(bufLength);
        const bufPtr = Deno.UnsafePointer.of(buf);
        const pwdBufPtr = Deno.UnsafePointer.of(pwdBuf);
        const resultBufPtr = Deno.UnsafePointer.of(resultBuf);

        try {
            ret = libc.symbols.getpwuid_r(uid, pwdBufPtr, bufPtr, bufLength, resultBufPtr);
        } catch (e) {
            return err<PwEnt>(e as Error);
        }

        if (ret === ERANGE) {
            bufLength *= 2;
            continue;
        }

        if (ret === 0) {
            const v = new Deno.UnsafePointerView(pwdBufPtr as unknown as Deno.PointerObject<unknown>);
            const nameId = v.getBigInt64(0);
            const namePtr = Deno.UnsafePointer.create(nameId);
            const name = Deno.UnsafePointerView.getCString(namePtr as Deno.PointerObject);
            const pwId = v.getBigInt64(8);
            const pwPtr = Deno.UnsafePointer.create(pwId);
            const pw = Deno.UnsafePointerView.getCString(pwPtr as Deno.PointerObject);
            const uid = v.getInt32(16);
            const gid = v.getInt32(20);
            const gecosId = v.getBigInt64(24);
            const gecosPtr = Deno.UnsafePointer.create(gecosId);
            const gecos = gecosPtr === null
                ? ""
                : Deno.UnsafePointerView.getCString(gecosPtr as Deno.PointerObject);
            const dirId = v.getBigInt64(32);
            const dirPtr = Deno.UnsafePointer.create(dirId);
            const dir = Deno.UnsafePointerView.getCString(dirPtr as Deno.PointerObject);
            const shellId = v.getBigInt64(40);
            const shellPtr = Deno.UnsafePointer.create(shellId);
            const shell = Deno.UnsafePointerView.getCString(shellPtr as Deno.PointerObject);

            const result = {
                name: name,
                passwd: pw,
                uid: uid,
                gid: gid,
                gecos: gecos,
                dir: dir,
                shell: shell,
            } as PwEnt;

            return ok(result);
        }

        return err<PwEnt>(new UnixError(ret, "Failed to get password entry"));
    }

    return err<PwEnt>(new UnixError(ret, "Failed to get password entry"));
}

/**
 * Get the group entry for the provided group id.
 * @param gid The group id to get the group entry for.
 * @returns The group entry for the provided group id.
 * @throws {NotSupportedError} Thrown if the method is not supported on the current platform.
 * @throws {MissingSymbolError} Thrown if the required symbol is not available in the libc library.
 * @throws {UnixError} Thrown if an error occurs while getting the group entry.
 */
export function groupEntry(gid: number): GrEnt {
    if (WINDOWS) {
        throw new NotSupportedError("getgrgid_r not implemented on Windows");
    }

    if (libc.symbols.getgrgid_r === undefined || libc.symbols.getgrgid_r === null) {
        throw new MissingSymbolError("getgrgid_r", "libc");
    }

    let ret = ERANGE as number;
    let bufLength = 120;
    while (ret === ERANGE) {
        const buf = new Uint8Array(bufLength);
        const grpBuf = new Uint8Array(bufLength);
        const resultBuf = new Uint8Array(bufLength);
        const bufPtr = Deno.UnsafePointer.of(buf);
        const grpBufPtr = Deno.UnsafePointer.of(grpBuf);
        const resultBufPtr = Deno.UnsafePointer.of(resultBuf);

        ret = libc.symbols.getgrgid_r(gid, grpBufPtr, bufPtr, bufLength, resultBufPtr);

        if (ret === ERANGE) {
            bufLength *= 2;
            continue;
        }

        if (ret === 0) {
            const v = new Deno.UnsafePointerView(grpBufPtr as unknown as Deno.PointerObject<unknown>);
            const nameId = v.getBigInt64(0);
            const namePtr = Deno.UnsafePointer.create(nameId);
            const name = Deno.UnsafePointerView.getCString(namePtr as Deno.PointerObject);

            const pwId = v.getBigInt64(8);
            const pwPtr = Deno.UnsafePointer.create(pwId);
            const pw = Deno.UnsafePointerView.getCString(pwPtr as Deno.PointerObject);

            const gid = v.getUint32(16);

            const membersPtr = v.getPointer(24);
            const set = new Array<string>();
            if (membersPtr !== null) {
                const members = new Deno.UnsafePointerView(membersPtr as Deno.PointerObject);
                let intptr = 0;

                let ptr: Deno.PointerValue = members.getPointer(intptr);
                while (ptr != null) {
                    set.push(Deno.UnsafePointerView.getCString(ptr));
                    intptr += 8;
                    ptr = members.getPointer(intptr);
                }
            }

            const result = {
                name: name,
                passwd: pw,
                gid: gid,
                members: set,
            } as GrEnt;

            return result;
        }

        throw new UnixError(ret, "Failed to get group entry");
    }

    throw new UnixError(ret, "Failed to get group entry");
}

/**
 * Get the group entry for the provided group id as a result object.
 * @param gid The group id to get the group entry for.
 * @returns The group entry for the provided group id as a result object.
 */
export function groupEntryResult(gid: number): Result<GrEnt> {
    if (WINDOWS) {
        return err<GrEnt>(new NotSupportedError("getgrgid_r not implemented on Windows"));
    }

    if (libc.symbols.getgrgid_r === undefined || libc.symbols.getgrgid_r === null) {
        return err<GrEnt>(new MissingSymbolError("getgrgid_r", "libc"));
    }

    let ret = ERANGE as number;
    let bufLength = 120;
    while (ret === ERANGE) {
        const buf = new Uint8Array(bufLength);
        const grpBuf = new Uint8Array(bufLength);
        const resultBuf = new Uint8Array(bufLength);
        const bufPtr = Deno.UnsafePointer.of(buf);
        const grpBufPtr = Deno.UnsafePointer.of(grpBuf);
        const resultBufPtr = Deno.UnsafePointer.of(resultBuf);

        try {
            ret = libc.symbols.getgrgid_r(gid, grpBufPtr, bufPtr, bufLength, resultBufPtr);
        } catch (e) {
            return err<GrEnt>(e as Error);
        }

        if (ret === ERANGE) {
            bufLength *= 2;
            continue;
        }

        if (ret === 0) {
            const v = new Deno.UnsafePointerView(grpBufPtr as unknown as Deno.PointerObject<unknown>);
            const nameId = v.getBigInt64(0);
            const namePtr = Deno.UnsafePointer.create(nameId);
            const name = Deno.UnsafePointerView.getCString(namePtr as Deno.PointerObject);

            const pwId = v.getBigInt64(8);
            const pwPtr = Deno.UnsafePointer.create(pwId);
            const pw = Deno.UnsafePointerView.getCString(pwPtr as Deno.PointerObject);

            const gid = v.getUint32(16);

            const membersPtr = v.getPointer(24);
            const set = new Array<string>();
            if (membersPtr !== null) {
                const members = new Deno.UnsafePointerView(membersPtr as Deno.PointerObject);
                let intptr = 0;

                let ptr: Deno.PointerValue = members.getPointer(intptr);
                while (ptr != null) {
                    set.push(Deno.UnsafePointerView.getCString(ptr));
                    intptr += 8;
                    ptr = members.getPointer(intptr);
                }
            }

            const result = {
                name: name,
                passwd: pw,
                gid: gid,
                members: set,
            } as GrEnt;

            return ok(result);
        }

        return err<GrEnt>(new UnixError(ret, "Failed to get group entry"));
    }

    return err<GrEnt>(new UnixError(ret, "Failed to get group entry"));
}