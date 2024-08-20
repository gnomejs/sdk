import { assert as ok } from "@std/assert";
import {
    euidResult,
    gidResult,
    groupEntryResult,
    groupnameResult,
    groupsResult,
    hostnameResult,
    passwdEntryResult,
    uidResult,
    usernameResult,
} from "./deno.ts";

const WINDOWS = Deno.build.os === "windows";

Deno.test("unix::libc::uidResult", { ignore: WINDOWS }, () => {
    const id = uidResult().expect("Failed to open libc");
    console.log(id);
    ok(id > -1);
});

Deno.test("unix::libc::euidResult", { ignore: WINDOWS }, () => {
    const userId = euidResult().expect("Failed to get effective user id");
    console.log(userId);
    ok(userId > -1);
});

Deno.test("unix::libc::hostnameResult", { ignore: WINDOWS }, () => {
    const hostname = hostnameResult().expect("Failed to get hostname");
    console.log(hostname);
    ok(hostname.length > 0);
});

Deno.test("unix::libc::usernameResult", { ignore: WINDOWS }, () => {
    const id = uidResult().expect("Failed to open libc");
    const username = usernameResult(id).expect("Failed to get username");
    ok(username.length > 0);
});

Deno.test("unix::libc::groupsResult", { ignore: WINDOWS }, () => {
    const groupIds = groupsResult().expect("Failed to get group ids");
    console.log(groupIds);
    ok(groupIds.length > 0);
});

Deno.test("unix::libc::gidResult", { ignore: WINDOWS }, () => {
    const gid = gidResult().expect("Failed to get group id");
    console.log(gid);
    ok(gid > 0);
});

Deno.test("unix::libc::groupEntryResult", { ignore: WINDOWS }, () => {
    const group = groupEntryResult(4).expect("Failed to get group entry");
    console.log(group);
    ok(group.name.length > 0);
});

Deno.test("unix::libc::groupnameResult", { ignore: WINDOWS }, () => {
    const gid = gidResult().expect("Failed to get group id");
    const groupname = groupnameResult(gid).expect("Failed to get group name");
    ok(groupname.length > 0);
});

Deno.test("unix::libc::passwdEntryRssult", { ignore: WINDOWS }, () => {
    const userId = uidResult().expect("Failed to get user id");
    const passwd = passwdEntryResult(userId).expect("Failed to get password entry");
    console.log(passwd);
    ok(passwd.name.length > 0);
});

Deno.test("getEffectiveGroupId", { ignore: WINDOWS }, () => {
    const gid = euidResult().expect("Failed to get effective group id");
    console.log(gid);
    ok(gid > 0);
});
