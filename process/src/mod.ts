const g = globalThis as Record<string, unknown>;

function notImplemented(name: string): never {
    throw new Error(`${name} is not implemented`);
}

const history = new Array<string>();

/**
 * The arguments passed to the current process
 * without the executable path.
 */
let args: string[] = [];

/**
 * The executable path of the current process.
 */
let execPath = "";

/**
 * Exits the process with the specified exit code.
 *
 * @description
 * In the the browser environment, this function closes the window.
 *
 * @param code The exit code.
 */
// deno-lint-ignore no-unused-vars
let exit = function (code?: number): void {
    notImplemented("exit");
};

/**
 * Updates the current working directory of the process. In
 * the browser environment, this function calls pushState
 *
 * @param directory The directory to change to.
 */
// deno-lint-ignore no-unused-vars
let chdir = function (directory: string): void {
    notImplemented("chdir");
};

/**
 * Gets the current working directory of the process.
 * In the browser environment, this function returns the
 * current URL or the last URL in the history if its
 * stored in the state.
 *
 * @returns The current working directory.
 */
let cwd = function (): string {
    notImplemented("cwd");
};

/**
 * Pushes the current working directory onto the directory
 * stack and changes the current working directory to the
 * specified directory.
 *
 * In the browser environment, this function calls pushState
 * to change the URL.
 *
 * @param directory The directory to change to.
 */
let pushd = function (directory: string): void {
    chdir(directory);
    history.push(directory);
};

/**
 * Pops the last directory from the directory stack and
 * changes the current working directory to that directory.
 * In the browser environment, this function calls history.back
 * to change the URL.
 *
 * @returns The last directory in the stack.
 */
let popd = function (): void {
    if (history.length > 0) {
        const directory = history.pop();
        if (directory) {
            chdir(directory);
        }
    }
};

/**
 * Gets the history of directories that have been visited using
 * the `pushd` and `popd` functions.
 * @returns The history of directories.
 */
export function getHistory(): string[] {
    return history.concat([]);
}

/**
 * The process ID of the current process.
 */
let pid: number = 0;

/**
 * A standard output writer, which represents the standard
 * output or error stream of the process.
 */
export interface StdWriter extends Record<string, unknown> {
    /**
     * Writes the specified chunk of data to the stream.
     * @param chunk The data to write.
     */
    write(chunk: Uint8Array): Promise<void>;
    /**
     * Writes the specified chunk of data to the stream synchronously.
     * @param chunk The data to write.
     */
    writeSync(chunk: Uint8Array): void;
    /**
     * Checks if stream is TTY (terminal).
     *
     * @returns True if the stream is a terminal; otherwise, false.
     */
    isTerm(): boolean;
    /**
     * Closes the stream, if applicable.
     */
    close(): void;
}

/**
 * A standard input reader, which represents the standard input
 * stream of the process.
 */
export interface StdReader extends Record<string, unknown> {
    /**
     * Reads a chunk of data from the stream.
     * @param data The chunk to read data into.
     */
    read(data: Uint8Array): Promise<number | null>;
    /**
     * Reads a chunk of data from the stream synchronously.
     * @param data The chunk to read data into.
     */
    readSync(data: Uint8Array): number | null;

    isTerm(): boolean;

    /**
     * Closes the stream, if applicable.
     */
    close(): void;
}

/**
 * A standard output writer, which represents the standard
 * output for the current process.
 */
let stdout: StdWriter = {
    buffer: "",
    /**
     * Writes the specified chunk of data to the stream.
     * @param chunk The data to write.
     */
    write(chunk: Uint8Array): Promise<void> {
        return new Promise((resolve) => {
            let msg = new TextDecoder().decode(chunk);
            let buffer = this.buffer as string;
            if (msg.includes("\n")) {
                const messages = msg.split("\n");
                for (let i = 0; i < messages.length - 1; i++) {
                    if (buffer.length > 0) {
                        console.log(buffer + messages[i]);
                        this.buffer = buffer = "";
                        continue;
                    }

                    console.log(messages[i]);
                }

                msg = messages[messages.length - 1];
            }

            if (!msg.endsWith("\n")) {
                this.buffer += msg;
                resolve();
            } else {
                this.buffer = "";
                const lines = buffer + msg;
                console.log(lines);
                resolve();
            }
        });
    },
    /**
     * Writes the specified chunk of data to the stream synchronously.
     * @param chunk The data to write.
     */
    writeSync(chunk: Uint8Array): void {
        let msg = new TextDecoder().decode(chunk);
        let buffer = this.buffer as string;
        if (msg.includes("\n")) {
            const messages = msg.split("\n");
            for (let i = 0; i < messages.length - 1; i++) {
                if (buffer.length > 0) {
                    console.log(buffer + messages[i]);
                    this.buffer = buffer = "";
                    continue;
                }

                console.log(messages[i]);
            }

            msg = messages[messages.length - 1];
        }

        if (!msg.endsWith("\n")) {
            this.buffer += msg;
        } else {
            this.buffer = "";
            const lines = buffer + msg;
            console.log(lines);
        }
    },

    /**
     * Checks if stream is TTY (terminal).
     *
     * @returns True if the stream is a terminal; otherwise, false.
     */
    isTerm(): boolean {
        return false;
    },
    close(): void {
    },
};

/**
 * A standard error writer, which represents the standard error
 * stream of the process.
 */
let stderr: StdWriter = {
    buffer: "",
    /**
     * Writes the specified chunk of data to the stream.
     * @param chunk The data to write.
     */
    write(chunk: Uint8Array): Promise<void> {
        return new Promise((resolve) => {
            const msg = new TextDecoder().decode(chunk);
            const buffer = this.buffer as string;

            if (!msg.endsWith("\n")) {
                this.buffer += msg;
                resolve();
            } else {
                this.buffer = "";
                const lines = buffer + msg;
                console.error(lines);
                resolve();
            }
        });
    },
    /**
     * Writes the specified chunk of data to the stream synchronously.
     * @param chunk The data to write.
     */
    writeSync(chunk: Uint8Array): void {
        const msg = new TextDecoder().decode(chunk);
        const buffer = this.buffer as string;

        if (!msg.endsWith("\n")) {
            this.buffer += msg;
        } else {
            this.buffer = "";
            const lines = buffer + msg;
            console.error(lines);
        }
    },
    /**
     * Checks if stream is TTY (terminal).
     *
     * @returns True if the stream is a terminal; otherwise, false.
     */
    isTerm(): boolean {
        return false;
    },
    close(): void {
    },
};

/**
 * A standard input reader, which represents the standard input
 * for the current process.
 */
let stdin: StdReader = {
    /**
     * Reads a chunk of data from the stream.
     * @param data The chunk to read data into.
     */
    // deno-lint-ignore no-unused-vars
    read(data: Uint8Array): Promise<number | null> {
        return Promise.resolve(null);
    },

    /**
     * Reads a chunk of data from the stream synchronously.
     * @param data The chunk to read data into.
     */
    // deno-lint-ignore no-unused-vars
    readSync(data: Uint8Array): number | null {
        return null;
    },
    isTerm(): boolean {
        return false;
    },

    /**
     * Closes the stream, if applicable.
     */
    close(): void {
    },
};

if (g.Deno) {
    // deno-lint-ignore no-explicit-any
    const Deno = g.Deno as any;
    pid = Deno.pid as number;
    args = Deno.args as string[];
    execPath = Deno.execPath();

    /**
     * Exits the process with the specified exit code.
     *
     * @description
     * In the the browser environment, this function closes the window.
     *
     * @param code The exit code.
     */
    exit = function (code?: number): void {
        Deno.exit(code);
    };

    /**
     * Updates the current working directory of the process. In
     * the browser environment, this function calls pushState
     *
     * @param directory The directory to change to.
     */
    chdir = function (directory: string): void {
        Deno.chdir(directory);
    };

    cwd = function (): string {
        return Deno.cwd();
    };

    stdout = {
        /**
         * Writes the specified chunk of data to the stream.
         * @param chunk The data to write.
         */
        write(chunk: Uint8Array): Promise<void> {
            return Deno.stdout.write(chunk);
        },

        /**
         * Writes the specified chunk of data to the stream synchronously.
         * @param chunk The data to write.
         */
        writeSync(chunk: Uint8Array): void {
            Deno.stdout.writeSync(chunk);
        },
        /**
         * Checks if stream is TTY (terminal).
         *
         * @returns True if the stream is a terminal; otherwise, false.
         */
        isTerm(): boolean {
            return Deno.stdout.isTerminal();
        },
        /**
         * Closes the stream, if applicable.
         */
        close(): void {
            Deno.stdout.close();
        },
    };

    stderr = {
        /**
         * Writes the specified chunk of data to the stream.
         * @param chunk The data to write.
         */
        write(chunk: Uint8Array): Promise<void> {
            return Deno.stderr.write(chunk);
        },
        /**
         * Writes the specified chunk of data to the stream synchronously.
         * @param chunk The data to write.
         */
        writeSync(chunk: Uint8Array): void {
            Deno.stderr.writeSync(chunk);
        },
        /**
         * Checks if stream is TTY (terminal).
         *
         * @returns True if the stream is a terminal; otherwise, false.
         */
        isTerm(): boolean {
            return Deno.stderr.isTerminal();
        },
        /**
         * Closes the stream, if applicable.
         */
        close(): void {
            Deno.stderr.close();
        },
    };

    stdin = {
        /**
         * Reads a chunk of data from the stream.
         * @param data The chunk to read data into.
         */
        read(data: Uint8Array): Promise<number | null> {
            return Deno.stdin.read(data);
        },
        /**
         * Reads a chunk of data from the stream synchronously.
         * @param data The chunk to read data into.
         */
        readSync(data: Uint8Array): number | null {
            return Deno.stdin.readSync(data);
        },
        isTerm(): boolean {
            return Deno.stdin.isTerminal();
        },

        /**
         * Closes the stream, if applicable.
         */
        close(): void {
            Deno.stdin.close();
        },
    };
} else if (g.process) {
    const fs = await import("node:fs");
    const process = g.process as NodeJS.Process;
    const a = process.argv.concat([]);
    execPath = process.execPath;
    a.shift();
    args = a;
    pid = process.pid;

    stdout = {
        /**
         * Writes the specified chunk of data to the stream.
         * @param chunk The data to write.
         */
        write(chunk: Uint8Array): Promise<void> {
            return new Promise((resolve, reject) => {
                process.stdout.write(chunk, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        },
        /**
         * Writes the specified chunk of data to the stream synchronously.
         * @param chunk The data to write.
         */
        writeSync(chunk: Uint8Array): void {
            fs.writeSync(process.stdout.fd, chunk);
        },
        /**
         * Checks if stream is TTY (terminal).
         *
         * @returns True if the stream is a terminal; otherwise, false.
         */
        isTerm(): boolean {
            return (process && process.stdout && process.stdout.isTTY) ?? false;
        },
        close(): void {
            process.stdout.end();
        },
    };

    stderr = {
        /**
         * Writes the specified chunk of data to the stream.
         * @param chunk The data to write.
         */
        write(chunk: Uint8Array): Promise<void> {
            return new Promise((resolve, reject) => {
                process.stderr.write(chunk, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        },
        /**
         * Writes the specified chunk of data to the stream synchronously.
         * @param chunk The data to write.
         */
        writeSync(chunk: Uint8Array): void {
            fs.writeSync(process.stderr.fd, chunk);
        },
        /**
         * Checks if stream is TTY (terminal).
         *
         * @returns True if the stream is a terminal; otherwise, false.
         */
        isTerm(): boolean {
            return (process && process.stderr && process.stderr.isTTY) ?? false;
        },
        close(): void {
            process.stderr.end();
        },
    };

    stdin = {
        /**
         * Reads a chunk of data from the stream.
         * @param data The chunk to read data into.
         */
        read(data: Uint8Array): Promise<number | null> {
            if (!this.isTerm()) {
                return Promise.resolve(null);
            }
            return new Promise((resolve, reject) => {
                // wait till data is available
                process.stdin.once("readable", () => {
                    const chunk = process.stdin.read(); // node Buffer
                    const data2 = new Uint8Array(chunk); // convert to Uint8Array
                    data.set(data2, 0); // copy to output buffer

                    // resolve with number of bytes read
                    resolve(data2.length);
                });

                process.stdin.once("end", () => {
                    resolve(null);
                });

                process.stdin.once("error", (err) => {
                    const e = err as NodeJS.ErrnoException;
                    switch (e.code) {
                        case "EAGAIN":
                            resolve(0);
                            break;
                        case "EOF":
                            resolve(0);
                            break;

                        default:
                            reject(err);
                    }
                });
            });
        },
        /**
         * Reads a chunk of data from the stream synchronously.
         * @param data The chunk to read data into.
         */
        readSync(data: Uint8Array): number | null {
            if (!this.isTerm()) {
                return null;
            }

            let bytesRead = 0;

            while (bytesRead === 0) {
                try {
                    bytesRead = fs.readSync(process.stdin.fd, data, 0, data.length, null);
                } catch (error) {
                    const e = error as NodeJS.ErrnoException;
                    if (e && typeof e.code === "string") {
                        if (e.code === "EAGAIN") {
                            // no data available, generally on nix systems
                            bytesRead = 0;
                            continue;
                        } else if (e.code === "EOF") {
                            // end of piped stdin, generally on windows
                            bytesRead = 0;
                            continue;
                        }
                    }

                    throw e; // unexpected exception
                }
            }

            return bytesRead;
        },
        isTerm(): boolean {
            return (process && process.stdin && process.stdin.isTTY) ?? false;
        },

        /**
         * Closes the stream, if applicable.
         */
        close(): void {
            process.stdin.end();
        },
    };

    /**
     * Exits the process with the specified exit code.
     *
     * @description
     * In the the browser environment, this function closes the window.
     *
     * @param code The exit code.
     */
    exit = function (code?: number): void {
        process.exit(code);
    };

    /**
     * Updates the current working directory of the process. In
     * the browser environment, this function calls pushState
     *
     * @param directory The directory to change to.
     */
    chdir = function (directory: string): void {
        process.chdir(directory);
    };

    /**
     * Gets the current working directory of the process.
     * In the browser environment, this function returns the
     * current URL or the last URL in the history if its
     * stored in the state.
     *
     * @returns The current working directory.
     */
    cwd = function (): string {
        return process.cwd();
    };
} else if (g.navigator) {
    // deno-lint-ignore no-explicit-any
    const window = g.window as any;

    /**
     * Exits the process with the specified exit code.
     *
     * @description
     * In the the browser environment, this function closes the window.
     *
     * @param code The exit code.
     */
    // deno-lint-ignore no-unused-vars
    exit = function (code?: number): void {
        globalThis.window.close();
    };

    /**
     * Gets the current working directory of the process.
     * In the browser environment, this function returns the
     * current URL or the last URL in the history if its
     * stored in the state.
     *
     * @returns The current working directory.
     */
    cwd = function (): string {
        if (window.history && window.history.state && window.history.state.url) {
            return window.history.state.url as string;
        }

        return window.location.pathname as string;
    };

    /**
     * Updates the current working directory of the process. In
     * the browser environment, this function calls pushState
     *
     * @param directory The directory to change to.
     */
    chdir = function (directory: string): void {
        window.history.pushState({ url: directory }, "", directory);
    };

    /**
     * Pushes the current working directory onto the directory
     * stack and changes the current working directory to the
     * specified directory.
     *
     * In the browser environment, this function calls pushState
     * to change the URL.
     *
     * @param directory The directory to change to.
     */
    pushd = function (directory: string): void {
        chdir(directory);
        history.push(directory);
    };

    /**
     * Pops the last directory from the directory stack and
     * changes the current working directory to that directory.
     * In the browser environment, this function calls history.back
     * to change the URL.
     *
     * @returns The last directory in the stack.
     */
    popd = function (): void {
        if (history.length > 0) {
            const directory = history.pop();
            if (directory) {
                window.history.back();
            }
        }
    };
}

export { args, chdir, cwd, execPath, exit, pid, popd, pushd, stderr, stdin, stdout };
