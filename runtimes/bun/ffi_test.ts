import { dlopen, ptr } from "../../ffi/bun/mod.ts";
import { test } from "bun:test";
import { ok } from "node:assert";

const WINDOWS = process.platform === "win32";

test.if(!WINDOWS)("ffi_dlopen", () => {
    const lib = dlopen("libc.so.6", {
        getuid: {
            args: [],
            returns: "u32",
        },
    });
    ok(lib);
    ok(lib.symbols.getuid);
    ok(lib.symbols.getuid() > 0);
    lib.close();
});

test.if(!WINDOWS)("ffi_dlopen", () => {
    const lib = dlopen("libc.so.6", {
        getpwuid_r: {
            args: ["u32", "pointer", "pointer", "u32", "pointer"],
            returns: "i32",
        },
    });

    const defaultUid = 1000;
    let userName = "";
    try {
        let ret = 34;
        let bufLength = 120;
        if (lib.symbols.getpwuid_r === undefined || lib.symbols.getpwuid_r === null) {
            throw new Error("Symbol getpwuid_r not found");
        }

        while (ret === 34) {
            const buf = new Uint8Array(bufLength);
            const pwdBuf = new Uint8Array(bufLength);
            const resultBuf = new Uint8Array(bufLength);
            const bufPtr = ptr(buf);
            const pwdBufPtr = ptr(pwdBuf);
            const resultBufPtr = ptr(resultBuf);

            ret = lib.symbols.getpwuid_r(defaultUid, pwdBufPtr, bufPtr, bufLength, resultBufPtr);

            if (ret === 34) {
                bufLength *= 2;
                continue;
            }

            if (ret === 0) {
                let last = 0;
                for (let i = 0; i < buf.length; i++) {
                    const c = buf[i];
                    if (c === 0) {
                        last = i + 1;
                        break;
                    }
                }

                userName = new TextDecoder().decode(buf.slice(0, last));
            }
        }

        console.log("User Name: ", userName);
        ok(userName.length > 0);
    } finally {
        lib.close();
    }
});
