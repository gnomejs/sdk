import { DARWIN, WINDOWS } from "@gnome/os-constants";
import { env } from "@gnome/env";
import { equalsIgnoreCase, startsWithIgnoreCase } from "@gnome/strings";
import { AnsiMode } from "./enums.ts";

let RELEASE = "";

// deno-lint-ignore no-explicit-any
const g = globalThis as any;
if (typeof g.Deno !== "undefined" || typeof g.process !== "undefined") {
    const { release } = await import("node:os");
    RELEASE = release();
}

function isTermVariableAnsiCompatible() {
    const set = [
        "^xterm",
        "^rxvt",
        "^cygwin",
        "ansi",
        "linux",
        "konsole",
        "tmux",
        "alacritty",
        "^vt100",
        "^vt220",
        "^vt220",
        "^vt320",
        "^screen",
    ];

    const term = env.get("TERM");
    if (term === undefined) {
        return false;
    }

    if (term === "dumb") {
        return false;
    }

    for (const s of set) {
        if (s[0] === "^") {
            if (startsWithIgnoreCase(term, s.substring(1))) {
                return true;
            }

            continue;
        }

        if (equalsIgnoreCase(term, s)) {
            return true;
        }
    }

    return false;
}

function detectCi() {
    if (env.has("CI")) {
        if (env.has("GITHUB_ACTIONS") || env.has("GITEA_ACTIONS")) {
            return AnsiMode.FourBit;
        }

        if (
            ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"].some((sign) => env.has(sign)) ||
            env.get("CI_NAME") === "codeship"
        ) {
            return AnsiMode.FourBit;
        }

        return AnsiMode.FourBit;
    }

    const teamCityVersion = env.get("TEAMCITY_VERSION");
    if (teamCityVersion) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(teamCityVersion) ? AnsiMode.FourBit : AnsiMode.None;
    }

    return null;
}

export function detectMode(): AnsiMode {
    const gsterm = env.get("GNOMESTACK_TERM");
    if (gsterm && gsterm.length) {
        switch (gsterm) {
            case "none":
            case "no-color":
            case "nocolor":
            case "0":
                return AnsiMode.None;

            case "3":
            case "3bit":
                return AnsiMode.ThreeBit;

            case "4":
            case "4bit":
                return AnsiMode.FourBit;

            case "8":
            case "8bit":
                return AnsiMode.EightBit;

            case "24":
            case "24bit":
            case "truecolor":
            case "color":
                return AnsiMode.TwentyFourBit;
        }
    }

    const term = env.get("TERM");

    if (env.has("TF_BUILD") && env.has("AGENT_NAME")) {
        return AnsiMode.FourBit;
    }

    const ci = detectCi();
    if (ci !== null) {
        return ci;
    }

    if (env.get("COLORTERM") === "truecolor") {
        return AnsiMode.TwentyFourBit;
    }

    if (term === "xterm-kitty") {
        return AnsiMode.TwentyFourBit;
    }

    if (DARWIN) {
        const termProgram = env.get("TERM_PROGRAM");
        if (termProgram !== undefined) {
            const version = Number.parseInt((env.get("TERM_PROGRAM_VERSION") || "").split(".")[0], 10);

            switch (termProgram) {
                case "iTerm.app": {
                    return version >= 3 ? AnsiMode.TwentyFourBit : AnsiMode.EightBit;
                }

                case "Apple_Terminal": {
                    return AnsiMode.EightBit;
                }
                    // No default
            }
        }
    }

    if (term) {
        if (/-256(color)?$/i.test(term)) {
            return AnsiMode.EightBit;
        }

        if (isTermVariableAnsiCompatible()) {
            return AnsiMode.FourBit;
        }
    }

    if (env.has("COLORTERM")) {
        return AnsiMode.FourBit;
    }

    if (WINDOWS) {
        const conEmu = env.get("ConEmuANSI");
        if (conEmu && conEmu.length) {
            switch (conEmu) {
                case "ON":
                case "on":
                case "On":
                case "1":
                    return AnsiMode.TwentyFourBit;
            }
        }

        const v = RELEASE.split(".");
        if (Number(v[0]) > 9 && Number(v[2]) >= 18262) {
            return AnsiMode.TwentyFourBit;
        } else {
            return AnsiMode.FourBit;
        }
    }

    return AnsiMode.None;
}
