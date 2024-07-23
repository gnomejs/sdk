import { cmd } from "./base.ts";
import { setLogger } from "./set_logger.ts";
export { cmd } from "./base.ts";
import { assert as ok, assertEquals as equal } from "@std/assert";
import { pathFinder } from "./path_finder.ts";
const hasExe = pathFinder.findExeSync("echo") !== undefined;

Deno.test("setLogger", { ignore: !hasExe }, async () => {
    let fileName = "";
    let args2: undefined | string[] = [];
    setLogger((file, args) => {
        fileName = file;
        args2 = args;
    });
    try {
        await cmd("echo", ["test"]);
        ok(fileName.endsWith("echo") || fileName.endsWith("echo.exe"));
        equal(args2, ["test"]);
    } finally {
        setLogger(undefined);
    }
});
