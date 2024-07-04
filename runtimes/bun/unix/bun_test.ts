import { test } from "bun:test";
import { fail, ok } from "node:assert";
import { openLibc } from "./bun.ts";

const WINDOWS = process.platform === "win32";

test.if(!WINDOWS)("unix: getUserId", () => {
    using libc = openLibc().expect("Failed to open libc");
    const userId = libc.getUserId().expect("Failed to get user id");
    console.log(userId);
    ok(userId > -1);
});

test.if(!WINDOWS)("unix: getEffectiveUserId", () => {
    using libc = openLibc().expect("Failed to open libc");
    const userId = libc.getEffectiveUserId().expect("Failed to get effective user id");
    console.log(userId);
    ok(userId > -1);
});

test.if(!WINDOWS)("unix: getHostname", () => {
    using libc = openLibc().expect("Failed to open libc");
    const r = libc.getHostName();
    if (r.isError) {
        const e = r.unwrapError();
        console.error(e);
        fail(e.message);
    }
    const hostname = libc.getHostName().expect("Failed to get hostname");
    console.log(hostname);
    ok(hostname.length > 0);
});

test.if(!WINDOWS)("unix: getProcessId", () => {
    using libc = openLibc().expect("Failed to open libc");
    const pid = libc.getProcessId().expect("Failed to get process id");
    console.log(pid);
    ok(pid > 0);
});

test.if(!WINDOWS)("unix: getParentProcessId", () => {
    using libc = openLibc().expect("Failed to open libc");
    const ppid = libc.getParentProcessId().expect("Failed to get parent process id");
    console.log(ppid);
    ok(ppid > 0);
});

test.if(!WINDOWS)("unix: getUserName", () => {
    using libc = openLibc().expect("Failed to open libc");
    const userId = libc.getUserId().expect("Failed to get user id");
    const username = libc.getUserName(userId).expect("Failed to get user name");
    console.log(username);
    ok(username.length > 0);
});

test.if(!WINDOWS)("unix: getGroupIds", () => {
    using libc = openLibc().expect("Failed to open libc");
    const groupIds = libc.getGroupIds().expect("Failed to get group ids");
    console.log(groupIds);
    ok(groupIds.length > 0);
});

test.if(!WINDOWS)("unix: getGroupName", () => {
    using libc = openLibc().expect("Failed to open libc");
    const groupIds = libc.getGroupIds().expect("Failed to get group ids");
    const groupName = libc.getGroupName(groupIds[0]).expect("Failed to get group name");
    console.log(groupName);
    ok(groupName.length > 0);
});

test.if(!WINDOWS)("unix: getGroupEntry", () => {
    using libc = openLibc().expect("Failed to open libc");
    const groupIds = libc.getGroupIds().expect("Failed to get group ids");
    const groupEntry = libc.getGroupEntry(groupIds[0]).expect("Failed to get group entry");
    console.log(groupEntry);
    ok(groupEntry.name.length > 0);
});

test.if(!WINDOWS)("unix: getEffectiveGroupId", () => {
    using libc = openLibc().expect("Failed to open libc");
    const gid = libc.getEffectiveGroupId().expect("Failed to get effective group id");
    console.log(gid);
    ok(gid > -1);
});

test.if(!WINDOWS)("unix: getGroupId", () => {
    using libc = openLibc().expect("Failed to open libc");
    const gid = libc.getGroupId().expect("Failed to get group id");
    console.log(gid);
    ok(gid > -1);
});

test.if(!WINDOWS)("unix: getPasswordEntry", () => {
    using libc = openLibc().expect("Failed to open libc");
    const userId = libc.getUserId().expect("Failed to get user id");
    const passwd = libc.getPasswordEntry(userId).expect("Failed to get password entry");
    console.log(passwd);
    ok(passwd.name.length > 0);
});
