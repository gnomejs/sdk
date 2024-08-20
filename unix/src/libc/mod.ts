import type { GrEnt, PwEnt } from "./structs.ts";
import { err, type Result } from "@gnome/monads";
import { NotSupportedError } from "@gnome/errors/not-supported-error";

// deno-lint-ignore no-explicit-any
const g = globalThis as any;

// deno-lint-ignore no-unused-vars
let passwdEntry = function (uid: number): PwEnt {
    throw new NotSupportedError("FFI for runtime not supported");
};

// deno-lint-ignore no-unused-vars
let passwdEntryResult = function (uid: number): Result<PwEnt> {
    return err(new NotSupportedError("FFI for runtime not supported"));
};

// deno-lint-ignore no-unused-vars
let groupEntry = function (gid: number): GrEnt {
    throw new NotSupportedError("FFI for runtime not supported");
};

// deno-lint-ignore no-unused-vars
let groupEntryResult = function (gid: number): Result<GrEnt> {
    return err(new NotSupportedError("FFI for runtime not supported"));
};

// deno-lint-ignore no-unused-vars
let username = function (uid: number): string {
    throw new NotSupportedError("FFI for runtime not supported");
};

// deno-lint-ignore no-unused-vars
let usernameResult = function (uid: number): Result<string> {
    return err(new NotSupportedError("FFI for runtime not supported"));
};

// deno-lint-ignore no-unused-vars
let groupname = function (gid: number): string {
    throw new NotSupportedError("FFI for runtime not supported");
};

// deno-lint-ignore no-unused-vars
let groupnameResult = function (gid: number): Result<string> {
    return err(new NotSupportedError("FFI for runtime not supported"));
};

let ppid = function (): number {
    throw new NotSupportedError("FFI for runtime not supported");
};

let ppidResult = function (): Result<number> {
    return err(new NotSupportedError("FFI for runtime not supported"));
};

let pid = function (): number {
    throw new NotSupportedError("FFI for runtime not supported");
};

let pidResult = function (): Result<number> {
    return err(new NotSupportedError("FFI for runtime not supported"));
};

let groups = function (): Uint32Array {
    throw new NotSupportedError("FFI for runtime not supported");
};

let groupsResult = function (): Result<Uint32Array> {
    return err(new NotSupportedError("FFI for runtime not supported"));
};

let egid = function (): number {
    throw new NotSupportedError("FFI for runtime not supported");
};

let egidResult = function (): Result<number> {
    return err(new NotSupportedError("FFI for runtime not supported"));
};

let euid = function (): number {
    throw new NotSupportedError("FFI for runtime not supported");
};

let euidResult = function (): Result<number> {
    return err(new NotSupportedError("FFI for runtime not supported"));
};

let gid = function (): number {
    throw new NotSupportedError("FFI for runtime not supported");
};

let gidResult = function (): Result<number> {
    return err(new NotSupportedError("FFI for runtime not supported"));
};

let uid = function (): number {
    throw new NotSupportedError("FFI for runtime not supported");
};

let uidResult = function (): Result<number> {
    return err(new NotSupportedError("FFI for runtime not supported"));
};

if (g.Deno) {
    const deno = await import("./deno.ts");
    passwdEntry = deno.passwdEntry;
    passwdEntryResult = deno.passwdEntryResult;
    groupEntry = deno.groupEntry;
    groupEntryResult = deno.groupEntryResult;
    username = deno.username;
    usernameResult = deno.usernameResult;
    groupname = deno.groupname;
    groupnameResult = deno.groupnameResult;
    ppid = deno.ppid;
    ppidResult = deno.ppidResult;
    pid = deno.pid;
    pidResult = deno.pidResult;
    groups = deno.groups;
    groupsResult = deno.groupsResult;
    egid = deno.egid;
    egidResult = deno.egidResult;
    euid = deno.euid;
    euidResult = deno.euidResult;
    gid = deno.gid;
    gidResult = deno.gidResult;
    uid = deno.uid;
    uidResult = deno.uidResult;
} else if (g.Bun) {
    const bun = await import("./bun.ts");
    passwdEntry = bun.passwdEntry;
    passwdEntryResult = bun.passwdEntryResult;
    groupEntry = bun.groupEntry;
    groupEntryResult = bun.groupEntryResult;
    username = bun.username;
    usernameResult = bun.usernameResult;
    groupname = bun.groupname;
    groupnameResult = bun.groupnameResult;
    ppid = bun.ppid;
    ppidResult = bun.ppidResult;
    pid = bun.pid;
    pidResult = bun.pidResult;
    groups = bun.groups;
    groupsResult = bun.groupsResult;
    egid = bun.egid;
    egidResult = bun.egidResult;
    euid = bun.euid;
    euidResult = bun.euidResult;
    gid = bun.gid;
    gidResult = bun.gidResult;
    uid = bun.uid;
    uidResult = bun.uidResult;
}

export {
    egid,
    egidResult,
    euid,
    euidResult,
    gid,
    gidResult,
    groupEntry,
    groupEntryResult,
    groupname,
    groupnameResult,
    groups,
    groupsResult,
    passwdEntry,
    passwdEntryResult,
    pid,
    pidResult,
    ppid,
    ppidResult,
    uid,
    uidResult,
    username,
    usernameResult,
};
