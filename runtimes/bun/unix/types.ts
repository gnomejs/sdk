import type { NativeLibrary } from "@gnome/ffi";
import type { Result } from "@gnome/optional";

export interface PwEnt {
    name: string;
    uid: number;
    gid: number;
    gecos: string;
    dir: string;
    shell: string;
}

export interface GrEnt {
    name: string;
    passwd: string;
    gid: number;
    members: string[];
}

export interface LibcLibrary extends NativeLibrary {
    getEffectiveGroupId(): Result<number>;

    getEffectiveUserId(): Result<number>;

    getGroupEntry(gid: number): Result<GrEnt>;

    getGroupIds(): Result<Uint32Array>;

    getGroupId(): Result<number>;

    getGroupName(gid: number): Result<string>;

    getHostName(): Result<string>;

    getParentProcessId(): Result<number>;

    getPasswordEntry(uid: number): Result<PwEnt>;

    getProcessId(): Result<number>;

    getUserId(): Result<number>;

    getUserName(uid: number): Result<string>;
}
