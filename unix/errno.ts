import { SystemError } from "@gnome/errors/system-error";

export const ENONE = 0;
export const EPERM = 1;
export const ENOENT = 2;
export const ESRCH = 3;
export const EINTR = 4;
export const EIO = 5;
export const ENXIO = 6;
export const E2BIG = 7;
export const ENOEXEC = 8;
export const EBADF = 9;
export const ECHILD = 10;
export const EAGAIN = 11;
export const ENOMEM = 12;
export const EACCES = 13;
export const EFAULT = 14;
export const ENOTBLK = 15;
export const EBUSY = 16;
export const EEXIST = 17;
export const EXDEV = 18;
export const ENODEV = 19;
export const ENOTDIR = 20;
export const EISDIR = 21;
export const EINVAL = 22;
export const ENFILE = 23;
export const EMFILE = 24;
export const ENOTTY = 25;
export const ERANGE = 34;
export const EPIPE = 32;
export const EDOM = 33;
export const EDEADLK = 36;
export const ENAMETOOLONG = 38;

export class UnixError extends SystemError {
    constructor(errno: number, message: string) {
        super(message ?? `Unix error ${errno}`);
        this.errno = errno;
    }

    readonly errno: number;
}
