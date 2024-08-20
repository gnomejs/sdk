import { DARWIN, WINDOWS } from "@gnome/runtime-info/os";
import { CString, dlopen, type Pointer, ptr, read } from "@gnome/ffi/bun";
import { fromCString, MissingSymbolError } from "@gnome/ffi";
import { NotSupportedError } from "@gnome/errors/not-supported-error";
import { ENAMETOOLONG, ERANGE, UnixError } from "../errno.ts";
import { err, ok, type Result } from "@gnome/monads/result";
import type { GrEnt, PwEnt } from "./structs.ts";

const libc = dlopen(DARWIN ? "libSystem.dylib" : "libc.so.6", {
    getpwuid_r: {
        args: ["u32", "pointer", "pointer", "u32", "pointer"],
        returns: "i32",
    },
    getpid: {
        args: [],
        returns: "i32",
    },
    getppid: {
        args: [],
        returns: "i32",
    },
    getuid: {
        args: [],
        returns: "u32",
    },
    geteuid: {
        args: [],
        returns: "u32",
    },
    getgid: {
        args: [],
        returns: "u32",
    },
    getegid: {
        args: [],
        returns: "u32",
    },
    gethostname: {
        args: ["pointer", "i32"],
        returns: "i32",
    },
    getgroups: {
        args: ["i32", "pointer"],
        returns: "i32",
    },
    getgrgid_r: {
        args: ["u32", "pointer", "pointer", "u32", "pointer"],
        returns: "i32",
    },
    strerror_r: {
        args: ["i32", "pointer", "i32"],
        returns: "i32",
    },
});

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
    let bufLength = 120;
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
    let bufLength = 120;
    while (ret === ENAMETOOLONG) {
        const buf = new Uint8Array(bufLength);
        ret = libc.symbols.gethostname(buf, bufLength);
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
        const bufPtr = ptr(buf);
        const grpBufPtr = ptr(grpBuf);
        const resultBufPtr = ptr(resultBuf);

        ret = libc.symbols.getgrgid_r(gid, grpBufPtr, bufPtr, bufLength, resultBufPtr);
        if (ret === 0) {
            return fromCString(buf);
        }

        if (ret !== ERANGE) {
            throw new UnixError(ret, "Failed to get group name");
        }

        bufLength *= 2;
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
        const bufPtr = ptr(buf);
        const grpBufPtr = ptr(grpBuf);
        const resultBufPtr = ptr(resultBuf);

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
        const bufPtr = ptr(buf);
        const pwdBufPtr = ptr(pwdBuf);
        const resultBufPtr = ptr(resultBuf);

        ret = libc.symbols.getpwuid_r(uid, pwdBufPtr, bufPtr, bufLength, resultBufPtr);
        if (ret === 0) {
            return fromCString(buf);
        }

        if (ret !== ERANGE) {
            throw new UnixError(ret, "Failed to get user name");
        }

        bufLength *= 2;
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
        const bufPtr = ptr(buf);
        const pwdBufPtr = ptr(pwdBuf);
        const resultBufPtr = ptr(resultBuf);

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
        const ret = libc.symbols.getppid();
        return ok(ret);
    } catch (e) {
        return err<number>(e as Error);
    }
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
        const bufPtr = ptr(buf);
        const pwdBufPtr = ptr(pwdBuf);
        const resultBufPtr = ptr(resultBuf);

        ret = libc.symbols.getpwuid_r(uid, pwdBufPtr, bufPtr, bufLength, resultBufPtr);
        if (ret === ERANGE) {
            bufLength *= 2;
            continue;
        }

        if (ret === 0) {
            const namePtr = read.ptr(pwdBufPtr, 0) as Pointer;
            const name = new CString(namePtr).toString();
            const pwPtr = read.ptr(pwdBufPtr, 8) as number;
            const pw = new CString(pwPtr as Pointer).toString();
            const uid = read.u32(pwdBufPtr, 16);
            const gid = read.u32(pwdBufPtr, 20);
            const gecosPtr = read.ptr(pwdBufPtr, 24) as number;
            const gecos = gecosPtr === null || gecosPtr === 0 ? "" : new CString(gecosPtr as Pointer).toString();
            const dirPtr = read.ptr(pwdBufPtr, 32);
            const dir = new CString(dirPtr as Pointer).toString();
            const shellPtr = read.ptr(pwdBufPtr, 40) as number;
            const shell = new CString(shellPtr as Pointer).toString();

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
        const bufPtr = ptr(buf);
        const pwdBufPtr = ptr(pwdBuf);
        const resultBufPtr = ptr(resultBuf);

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
            const namePtr = read.ptr(pwdBufPtr, 0) as Pointer;
            const name = new CString(namePtr).toString();
            const pwPtr = read.ptr(pwdBufPtr, 8) as number;
            const pw = new CString(pwPtr as Pointer).toString();
            const uid = read.u32(pwdBufPtr, 16);
            const gid = read.u32(pwdBufPtr, 20);
            const gecosPtr = read.ptr(pwdBufPtr, 24) as number;
            const gecos = gecosPtr === null || gecosPtr === 0 ? "" : new CString(gecosPtr as Pointer).toString();
            const dirPtr = read.ptr(pwdBufPtr, 32);
            const dir = new CString(dirPtr as Pointer).toString();
            const shellPtr = read.ptr(pwdBufPtr, 40) as number;
            const shell = new CString(shellPtr as Pointer).toString();

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
        const bufPtr = ptr(buf);
        const grpBufPtr = ptr(grpBuf);
        const resultBufPtr = ptr(resultBuf);

        ret = libc.symbols.getgrgid_r(gid, grpBufPtr, bufPtr, bufLength, resultBufPtr);
        if (ret === ERANGE) {
            bufLength *= 2;
            continue;
        }

        if (ret === 0) {
            const namePtr = read.ptr(grpBufPtr, 0) as Pointer;
            const name = new CString(namePtr).toString();
            const pwPtr = read.ptr(grpBufPtr, 8) as Pointer;
            const pw = new CString(pwPtr).toString();
            const gid = read.u32(grpBufPtr, 16);
            const membersPtr = read.ptr(grpBufPtr, 24) as Pointer;

            const set = new Array<string>();
            let i = 0;
            let intptr = read.ptr(membersPtr, 0) as number;
            i += 8;
            while (intptr !== 0) {
                intptr = read.ptr(membersPtr, i) as number;
                i += 8;
                if (intptr === 0) {
                    break;
                }

                const member = new CString(intptr as Pointer);
                set.push(member.toString());
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
        const bufPtr = ptr(buf);
        const grpBufPtr = ptr(grpBuf);
        const resultBufPtr = ptr(resultBuf);

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
            const namePtr = read.ptr(grpBufPtr, 0) as Pointer;
            const name = new CString(namePtr);
            const pwPtr = read.ptr(grpBufPtr, 8) as Pointer;
            const pw = new CString(pwPtr);
            const gid = read.u32(grpBufPtr, 16);
            const membersPtr = read.ptr(grpBufPtr, 24) as Pointer;

            const set = new Array<string>();
            let i = 0;
            let intptr = read.ptr(membersPtr, 0) as number;
            i += 8;
            while (intptr !== 0) {
                intptr = read.ptr(membersPtr, i) as number;
                i += 8;
                if (intptr === 0) {
                    break;
                }

                const member = new CString(intptr as Pointer);
                set.push(member.toString());
            }

            const result = {
                name: name.toString(),
                passwd: pw.toString(),
                gid: gid,
                members: set,
            } as GrEnt;

            return ok(result);
        }

        return err<GrEnt>(new UnixError(ret, "Failed to get group entry"));
    }

    return err<GrEnt>(new UnixError(ret, "Failed to get group entry"));
}
