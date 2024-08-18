import fs from "node:fs";
fs.copyFileSync("../../src/mod.ts", "./mod.ts");
const { stdout, stdin } = await import("./mod.js");
console.log(stdout);
await stdout.write(new TextEncoder().encode("stdout.write\n"));
stdout.writeSync(new TextEncoder().encode("stdout.writeSync\n"));
console.log(`stdout.is_term:${stdout.isTerm()}`);

const data = new Uint8Array(1024);
const count = await stdin.read(data);
console.log("stdin.read", count);

data.fill(0);
const syncCount = stdin.readSync(data);
console.log("stdin.readSync", syncCount);
console.log(new TextDecoder().decode(data));
