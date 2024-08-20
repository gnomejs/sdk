
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