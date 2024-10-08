import { RUNTIME } from "@gnome/runtime-info/js";
import type { FileSystem } from "./types.ts";

let fs: FileSystem;

// deno-lint-ignore no-explicit-any
const g = globalThis as any;
if (g.process && g.process.versions && g.process.versions.node) {
    fs = await import("./node/mod.ts");
} else if (g.Deno) {
    fs = await import("./deno/mod.ts");
} else {
    throw new Error(`Unsupported runtime ${RUNTIME}`);
}

// destructuring can not handled by deno/jsr's fast check
// https://jsr.io/docs/about-slow-types#no-destructuring-in-exports
export const uid = fs.uid;
export const gid = fs.gid;
export const copyFile = fs.copyFile;
export const copyFileSync = fs.copyFileSync;
export const cwd = fs.cwd;
export const isDir = fs.isDir;
export const isDirSync = fs.isDirSync;
export const isFile = fs.isFile;
export const isFileSync = fs.isFileSync;
export const isNotFoundError = fs.isNotFoundError;
export const isAlreadyExistsError = fs.isAlreadyExistsError;
export const link = fs.link;
export const linkSync = fs.linkSync;
export const lstat = fs.lstat;
export const lstatSync = fs.lstatSync;
export const makeDir = fs.makeDir;
export const makeDirSync = fs.makeDirSync;
export const makeTempDir = fs.makeTempDir;
export const makeTempDirSync = fs.makeTempDirSync;
export const makeTempFile = fs.makeTempFile;
export const makeTempFileSync = fs.makeTempFileSync;
export const chmod = fs.chmod;
export const chmodSync = fs.chmodSync;
export const chown = fs.chown;
export const chownSync = fs.chownSync;
export const open = fs.open;
export const openSync = fs.openSync;
export const readDir = fs.readDir;
export const readDirSync = fs.readDirSync;
export const readFile = fs.readFile;
export const readFileSync = fs.readFileSync;
export const readLink = fs.readLink;
export const readLinkSync = fs.readLinkSync;
export const readTextFile = fs.readTextFile;
export const readTextFileSync = fs.readTextFileSync;
export const realPath = fs.realPath;
export const realPathSync = fs.realPathSync;
export const remove = fs.remove;
export const removeSync = fs.removeSync;
export const rename = fs.rename;
export const renameSync = fs.renameSync;
export const stat = fs.stat;
export const statSync = fs.statSync;
export const symlink = fs.symlink;
export const symlinkSync = fs.symlinkSync;
export const writeFile = fs.writeFile;
export const writeFileSync = fs.writeFileSync;
export const writeTextFile = fs.writeTextFile;
export const writeTextFileSync = fs.writeTextFileSync;
export const utime = fs.utime;
export const utimeSync = fs.utimeSync;

export default {
    uid,
    gid,
    copyFile,
    copyFileSync,
    cwd,
    isDir,
    isDirSync,
    isFile,
    isFileSync,
    isNotFoundError,
    isAlreadyExistsError,
    link,
    linkSync,
    lstat,
    lstatSync,
    makeDir,
    makeDirSync,
    makeTempDir,
    makeTempDirSync,
    makeTempFile,
    makeTempFileSync,
    chmod,
    chmodSync,
    chown,
    chownSync,
    open,
    openSync,
    readDir,
    readDirSync,
    readFile,
    readFileSync,
    readLink,
    readLinkSync,
    readTextFile,
    readTextFileSync,
    realPath,
    realPathSync,
    remove,
    removeSync,
    rename,
    renameSync,
    stat,
    statSync,
    symlink,
    symlinkSync,
    writeFile,
    writeFileSync,
    writeTextFile,
    writeTextFileSync,
    utime,
    utimeSync,
} as FileSystem;
