import { splat, type SplatObject } from "./splat.ts";
import { splitArguments } from "./split_arguments.ts";

export type CommandArgs = string[] | string | SplatObject;

export function convertCommandArgs(args: CommandArgs): string[] {
    if (typeof args === "string") {
        return splitArguments(args);
    }

    if (Array.isArray(args)) {
        return args;
    }

    return splat(args);
}
