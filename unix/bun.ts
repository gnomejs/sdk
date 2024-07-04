import type { Library } from "@gnome/ffi/bun/ffi";
import { CString, dlopen, Pointer, ptr, read } from "@gnome/ffi/bun";
import { MissingSymbolError } from "@gnome/ffi/errors";
import { NotSupportedError } from "@gnome/errors/not-supported-error";
import { WINDOWS } from "@gnome/os-constants";
import { GrEnt, LibcLibrary, PwEnt } from "./types.ts";
import { ENAMETOOLONG, ERANGE, UnixError } from "./errno.ts";
import { err, ok, Result } from "@gnome/optional";
import { toCString } from "./_utils.ts";

// deno-lint-ignore no-explicit-any
const g = globalThis as any;
if (typeof g.Bun === "undefined") {
    throw new NotSupportedError("@gnome/unix/bun is not supported in the current JavaScript runtime.");
}

type LibcMethods = Library<{
    getpwuid_r: {
        args: ["u32", "pointer", "pointer", "u32", "pointer"];
        returns: "i32";
    };
    getpid: {
        args: [];
        returns: "i32";
    };
    getppid: {
        args: [];
        returns: "i32";
    };
    getuid: {
        args: [];
        returns: "u32";
    };
    geteuid: {
        args: [];
        returns: "u32";
    };
    getgid: {
        args: [];
        returns: "u32";
    };
    getegid: {
        args: [];
        returns: "u32";
    };
    gethostname: {
        args: ["pointer", "i32"];
        returns: "i32";
    };
    getgroups: {
        args: ["i32", "pointer"];
        returns: "i32";
    };
    getgrgid_r: {
        args: ["u32", "pointer", "pointer", "u32", "pointer"];
        returns: "i32";
    };
    strerror_r: {
        args: ["i32", "pointer", "i32"];
        returns: "i32";
    };
}>;

export class BunLibc implements LibcLibrary {
    #lib: LibcMethods;

    constructor() {
        this.#lib = dlopen(process.platform === "darwin" ? "libSystem.dylib" : "libc.so.6", {
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
    }

    close(): void {
        this.#lib.close();
    }

    [Symbol.dispose](): void {
        this.close();
    }

    getGroupId(): Result<number, Error> {
        if (WINDOWS) {
            return err<number>(new NotSupportedError("getgid not implemented on Windows"));
        }

        if (this.#lib.symbols.getgid === undefined || this.#lib.symbols.getgid === null) {
            return err<number>(new MissingSymbolError("getgid", "libc"));
        }

        try {
            return ok(this.#lib.symbols.getgid());
        } catch (e) {
            return err<number>(e as Error);
        }
    }

    getEffectiveGroupId(): Result<number> {
        if (WINDOWS) {
            return err<number>(new NotSupportedError("getegid not implemented on Windows"));
        }

        if (this.#lib.symbols.getegid === undefined || this.#lib.symbols.getegid === null) {
            return err<number>(new MissingSymbolError("getegid", "libc"));
        }

        try {
            return ok(this.#lib.symbols.getegid());
        } catch (e) {
            return err<number>(e as Error);
        }
    }

    getHostName(): Result<string> {
        if (WINDOWS) {
            return err<string>(new NotSupportedError("gethostname not implemented on Windows"));
        }

        if (this.#lib.symbols.gethostname === undefined || this.#lib.symbols.gethostname === null) {
            return err<string>(new MissingSymbolError("gethostname", "libc"));
        }

        let ret = ENAMETOOLONG as number;
        let bufLength = 120;
        while (ret === ENAMETOOLONG) {
            const buf = new Uint8Array(bufLength);
            ret = this.#lib.symbols.gethostname(buf, bufLength);
            if (ret === 0) {
                return ok(toCString(buf));
            }

            if (ret !== ENAMETOOLONG) {
                return err<string>(new UnixError(ret, "Failed to get hostname"));
            }

            bufLength *= 2;
        }

        return err<string>(new UnixError(ret, "Failed to get hostname"));
    }

    getUserId(): Result<number> {
        if (WINDOWS) {
            return err<number>(new NotSupportedError("getuid not implemented on Windows"));
        }

        if (this.#lib.symbols.getuid === undefined || this.#lib.symbols.getuid === null) {
            return err<number>(new MissingSymbolError("getuid", "libc"));
        }

        try {
            return ok(this.#lib.symbols.getuid());
        } catch (e) {
            return err<number>(e as Error);
        }
    }

    getEffectiveUserId(): Result<number> {
        if (WINDOWS) {
            return err<number>(new NotSupportedError("geteuid not implemented on Windows"));
        }

        if (this.#lib.symbols.geteuid === undefined || this.#lib.symbols.geteuid === null) {
            return err<number>(new MissingSymbolError("geteuid", "libc"));
        }

        try {
            return ok(this.#lib.symbols.geteuid());
        } catch (e) {
            return err<number>(e as Error);
        }
    }

    getGroupIds(): Result<Uint32Array> {
        if (WINDOWS) {
            return err<Uint32Array>(new NotSupportedError("getgroups not implemented on Windows"));
        }

        if (this.#lib.symbols.getgroups === undefined || this.#lib.symbols.getgroups === null) {
            return err<Uint32Array>(new MissingSymbolError("getgroups", "libc"));
        }

        const buf = new Uint32Array(1024);
        let ret = 0;
        try {
            ret = this.#lib.symbols.getgroups(1024, buf);
        } catch (e) {
            return err<Uint32Array>(e as Error);
        }

        if (ret === -1) {
            return err<Uint32Array>(new UnixError(ret, "Failed to get groups ids"));
        }

        const groups = buf.slice(0, ret);
        return ok(groups);
    }

    getProcessId(): Result<number> {
        if (WINDOWS) {
            return err<number>(new NotSupportedError("getpid not implemented on Windows"));
        }

        if (this.#lib.symbols.getpid === undefined || this.#lib.symbols.getpid === null) {
            return err<number>(new MissingSymbolError("getpid", "libc"));
        }

        try {
            return ok(this.#lib.symbols.getpid());
        } catch (e) {
            return err<number>(e as Error);
        }
    }

    getGroupName(gid: number): Result<string> {
        if (WINDOWS) {
            return err<string>(new NotSupportedError("getgrgid_r not implemented on Windows"));
        }

        if (this.#lib.symbols.getgrgid_r === undefined || this.#lib.symbols.getgrgid_r === null) {
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
                ret = this.#lib.symbols.getgrgid_r(gid, grpBufPtr, bufPtr, bufLength, resultBufPtr);
            } catch (e) {
                return err<string>(e as Error);
            }

            if (ret === ERANGE) {
                bufLength *= 2;
                continue;
            }

            if (ret === 0) {
                return ok(toCString(buf));
            }

            return err<string>(new UnixError(ret, "Failed to get group name"));
        }

        return err<string>(new UnixError(ret, "Failed to get group name"));
    }

    getUserName(uid: number): Result<string> {
        if (WINDOWS) {
            return err<string>(new NotSupportedError("getpwuid_r not implemented on Windows"));
        }

        if (this.#lib.symbols.getpwuid_r === undefined || this.#lib.symbols.getpwuid_r === null) {
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
                ret = this.#lib.symbols.getpwuid_r(uid, pwdBufPtr, bufPtr, bufLength, resultBufPtr);
            } catch (e) {
                return err<string>(e as Error);
            }

            if (ret === ERANGE) {
                bufLength *= 2;
                continue;
            }

            if (ret === 0) {
                return ok(toCString(buf));
            }

            return err<string>(new UnixError(ret, "Failed to get user name"));
        }

        return err<string>(new UnixError(ret, "Failed to get user name"));
    }

    getParentProcessId(): Result<number> {
        if (WINDOWS) {
            return err<number>(new NotSupportedError("getppid not implemented on Windows"));
        }

        if (this.#lib.symbols.getppid === undefined || this.#lib.symbols.getppid === null) {
            return err<number>(new MissingSymbolError("getppid", "libc"));
        }

        try {
            const ret = this.#lib.symbols.getppid();
            return ok(ret);
        } catch (e) {
            return err<number>(e as Error);
        }
    }

    getPasswordEntry(uid: number): Result<PwEnt> {
        if (WINDOWS) {
            return err<PwEnt>(new NotSupportedError("getpwuid_r not implemented on Windows"));
        }

        if (this.#lib.symbols.getpwuid_r === undefined || this.#lib.symbols.getpwuid_r === null) {
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
                ret = this.#lib.symbols.getpwuid_r(uid, pwdBufPtr, bufPtr, bufLength, resultBufPtr);
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
                const gecos =  gecosPtr === null || gecosPtr === 0 ? "" : new CString(gecosPtr as Pointer).toString();
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

    getGroupEntry(gid: number): Result<GrEnt> {
        if (WINDOWS) {
            return err<GrEnt>(new NotSupportedError("getgrgid_r not implemented on Windows"));
        }

        if (this.#lib.symbols.getgrgid_r === undefined || this.#lib.symbols.getgrgid_r === null) {
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
                ret = this.#lib.symbols.getgrgid_r(gid, grpBufPtr, bufPtr, bufLength, resultBufPtr);
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
}

export function openLibc(): Result<LibcLibrary> {
    if (WINDOWS) {
        return err<LibcLibrary>(new NotSupportedError("libc is not supported on Windows."));
    }

    try {
        return ok(new BunLibc());
    } catch (e) {
        return err<LibcLibrary>(e);
    }
}
