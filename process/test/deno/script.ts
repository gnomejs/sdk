import { stdin, stdout } from "../../src/mod.ts";

await stdout.write(new TextEncoder().encode("stdout.write\n"));
stdout.writeSync(new TextEncoder().encode("stdout.writeSync\n"));
console.log(`stdout.is_term:${stdout.isTerm()}`);
const data = new Uint8Array(1024);
const count = await stdin.read(data);
console.log("stdin.read", count);
data.fill(0);
const syncCount = stdin.readSync(data);
console.log("stdin.readSync", syncCount);
