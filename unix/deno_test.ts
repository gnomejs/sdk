import { assert as ok, fail } from "@std/assert";
const { openLibc } = await import("./deno.ts");

const WINDOWS = Deno.build.os === "windows";

Deno.test("unix: openlbic", { ignore: WINDOWS }, () => {
    const r = openLibc();
    if (r.isError) {
        const e = r.unwrapError();
        console.error(e);
        fail(e.message);
    }

    using libc = r.expect("Failed to open libc");
    console.log(libc);
});

Deno.test("getUserId", { ignore: WINDOWS }, () => {
    using libc = openLibc().expect("Failed to open libc");
    const userId = libc.getUserId().expect("Failed to get user id");
    console.log(userId);
    ok(userId > -1);
});

Deno.test("getEffectiveUserId", { ignore: WINDOWS }, () => {
    using libc = openLibc().expect("Failed to open libc");
    const userId = libc.getEffectiveUserId().expect("Failed to get effective user id");
    console.log(userId);
    ok(userId > -1);
});

Deno.test("getHostname", { ignore: WINDOWS }, () => {
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

Deno.test("getProcessId", { ignore: WINDOWS }, () => {
    using libc = openLibc().expect("Failed to open libc");
    const pid = libc.getProcessId().expect("Failed to get process id");
    console.log(pid);
    ok(pid > 0);
});

Deno.test("getParentProcessId", { ignore: WINDOWS }, () => {
    using libc = openLibc().expect("Failed to open libc");
    const ppid = libc.getParentProcessId().expect("Failed to get parent process id");
    console.log(ppid);
    ok(ppid > 0);
});

Deno.test("getUserName", { ignore: WINDOWS }, () => {
    using libc = openLibc().expect("Failed to open libc");
    const userId = libc.getUserId().expect("Failed to get user id");
    const username = libc.getUserName(userId).expect("Failed to get user name");
    ok(username.length > 0);
});

Deno.test("getGroupIds", { ignore: WINDOWS }, () => {
    using libc = openLibc().expect("Failed to open libc");
    const groupIds = libc.getGroupIds().expect("Failed to get group ids");
    console.log(groupIds);
    ok(groupIds.length > 0);
});

Deno.test("getGroupId", { ignore: WINDOWS }, () => {
    using libc = openLibc().expect("Failed to open libc");
    const gid = libc.getGroupId().expect("Failed to get group id");
    console.log(gid);
    ok(gid > 0);
});

Deno.test("getGroupEntry", { ignore: WINDOWS }, () => {
    using libc = openLibc().expect("Failed to open libc");
    const group = libc.getGroupEntry(4).expect("Failed to get group entry");
    console.log(group);
    ok(group.name.length > 0);
});

Deno.test("getGroupName", { ignore: WINDOWS }, () => {
    using libc = openLibc().expect("Failed to open libc");
    const gid = libc.getGroupId().expect("Failed to get group id");
    const groupname = libc.getGroupName(gid).expect("Failed to get group name");
    ok(groupname.length > 0);
});

Deno.test("getPasswordEntry", { ignore: WINDOWS }, () => {
    using libc = openLibc().expect("Failed to open libc");
    const userId = libc.getUserId().expect("Failed to get user id");
    const passwd = libc.getPasswordEntry(userId).expect("Failed to get password entry");
    console.log(passwd);
    ok(passwd.name.length > 0);
});

Deno.test("getEffectiveGroupId", { ignore: WINDOWS }, () => {
    using libc = openLibc().expect("Failed to open libc");
    const gid = libc.getEffectiveGroupId().expect("Failed to get effective group id");
    console.log(gid);
    ok(gid > 0);
});
