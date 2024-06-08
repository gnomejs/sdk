import { Lazy } from "./_lazy.ts";
import { detectMode } from "./detector.ts";
import { AnsiMode } from "./enums.ts";

let settings = new Lazy<AnsiSettings>(() => new AnsiSettings(detectMode()));

// deno-lint-ignore no-explicit-any
const g = globalThis as any;

export function isStdoutTerminal(): boolean {
    if (typeof g.Deno !== "undefined") {
        return Deno.stdout.isTerminal();
    } else if (typeof g.process !== "undefined") {
        return g.process.stdout.isTTY;
    }

    return true;
}

export function isStderrTerminal(): boolean {
    if (typeof g.Deno !== "undefined") {
        return Deno.stderr.isTerminal();
    } else if (typeof g.process !== "undefined") {
        return g.process.stderr.isTTY;
    }

    return true;
}

export class AnsiSettings {
    #mode: AnsiMode;
    #links: boolean;

    constructor(mode: AnsiMode) {
        this.#mode = mode;
        this.#links = this.#mode === AnsiMode.TwentyFourBit;
    }

    static get current(): AnsiSettings {
        return settings.value;
    }

    static set current(value: AnsiSettings) {
        settings = new Lazy<AnsiSettings>(() => value);
    }

    get stdout(): boolean {
        if (this.#mode > 0) {
            return !isStdoutTerminal();
        }

        return false;
    }

    get stderr(): boolean {
        if (this.#mode > 0) {
            return !isStderrTerminal();
        }

        return false;
    }

    get mode(): AnsiMode {
        return this.#mode;
    }

    set mode(value: AnsiMode) {
        this.#mode = value;
    }

    get links(): boolean {
        return this.#links;
    }

    set links(value: boolean) {
        this.#links = value;
    }
}
