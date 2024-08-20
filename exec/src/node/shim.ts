import process from "node:process";
// deno-lint-ignore no-explicit-any
const g = globalThis as any;

if (!g.process) {
    g.process = process;
}
