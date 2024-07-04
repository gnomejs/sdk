import { MissingSymbolError } from "@gnome/ffi/errors";
import { NotSupportedError } from "@gnome/errors/not-supported-error";
import { WINDOWS } from "@gnome/os-constants";
import { GrEnt, LibcLibrary, PwEnt } from "./types.ts";
import { ENAMETOOLONG, ERANGE, UnixError } from "./errno.ts";
import { err, ok, Result } from "@gnome/optional";
import { toCString } from "./_utils.ts";

// deno-lint-ignore no-explicit-any
const g = globalThis as any;
if (typeof g.Deno === "undefined") {
    throw new NotSupportedError("@gnome/unix/deno is not supported in the current JavaScript runtime.");
}

type LibcMethods = Deno.DynamicLibrary<{
    getpwuid_r: {
        parameters: ["u32", "pointer", "pointer", "u32", "pointer"];
        result: "i32";
        optional: true;
    };
    getpid: {
        parameters: [];
        result: "i32";
        optional: true;
    };
    getppid: {
        parameters: [];
        result: "i32";
        optional: true;
    };
    getuid: {
        parameters: [];
        result: "u32";
        optional: true;
    };
    geteuid: {
        parameters: [];
        result: "u32";
        optional: true;
    };
    getgid: {
        parameters: [];
        result: "u32";
        optional: true;
    };
    getegid: {
        parameters: [];
        result: "u32";
        optional: true;
    };
    gethostname: {
        parameters: ["buffer", "i32"];
        result: "i32";
        optional: true;
    };
    getgroups: {
        parameters: ["i32", "buffer"];
        result: "i32";
        optional: true;
    };
    getgrgid_r: {
        parameters: ["u32", "pointer", "pointer", "u32", "pointer"];
        result: "i32";
        optional: true;
    };
    strerror_r: {
        parameters: ["i32", "buffer", "i32"];
        result: "i32";
        optional: true;
    };
}>;

export class DenoLibc implements LibcLibrary {
    #lib: LibcMethods;

    constructor() {
        this.#lib = Deno.dlopen("libc.so.6", {
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
        });
    }

    close(): void {
        this.#lib.close();
    }

    [Symbol.dispose](): void {
        this.close();
    }

    getHostName(): Result<string> {
        if (WINDOWS) {
            return err<string>(new NotSupportedError("gethostname not implemented on Windows"));
        }

        if (this.#lib.symbols.gethostname === undefined || this.#lib.symbols.gethostname === null) {
            return err<string>(new MissingSymbolError("gethostname", "libc"));
        }

        let ret = ENAMETOOLONG as number;
        let bufLength = 64;
        while (ret === ENAMETOOLONG) {
            const buf = new Uint8Array(bufLength);
            try {
                ret = this.#lib.symbols.gethostname(buf, bufLength);
            } catch (e) {
                return err<string>(e as Error);
            }

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

    getGroupId(): Result<number> {
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
            const bufPtr = Deno.UnsafePointer.of(buf);
            const grpBufPtr = Deno.UnsafePointer.of(grpBuf);
            const resultBufPtr = Deno.UnsafePointer.of(resultBuf);

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
            const bufPtr = Deno.UnsafePointer.of(buf);
            const pwdBufPtr = Deno.UnsafePointer.of(pwdBuf);
            const resultBufPtr = Deno.UnsafePointer.of(resultBuf);

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
            const bufPtr = Deno.UnsafePointer.of(buf);
            const pwdBufPtr = Deno.UnsafePointer.of(pwdBuf);
            const resultBufPtr = Deno.UnsafePointer.of(resultBuf);

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
                const gecos = Deno.UnsafePointerView.getCString(gecosPtr as Deno.PointerObject);
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
            const bufPtr = Deno.UnsafePointer.of(buf);
            const grpBufPtr = Deno.UnsafePointer.of(grpBuf);
            const resultBufPtr = Deno.UnsafePointer.of(resultBuf);

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
}

export function openLibc(): Result<LibcLibrary> {
    if (WINDOWS) {
        return err<LibcLibrary>(new NotSupportedError("libc is not supported on Windows."));
    }

    try {
        return ok(new DenoLibc());
    } catch (e) {
        return err<LibcLibrary>(e);
    }
}
