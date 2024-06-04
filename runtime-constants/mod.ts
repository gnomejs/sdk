/**
 * JavaScript runtime detection which is useful for writing
 * compatability layers in modules for different runtimes.
 *
 * ## Basic Usage
 *
 * ```typescript
 * import { RUNTIME, BUN, DENO, NODE, BROWSER } from "@gnome/runtime-info";
 *
 * console.log(RUNTIME);
 * console.log("bun", BUN);
 * console.log("deno", DENO);
 * console.log("node", NODE);
 * console.log("browser", BROWSER);
 * console.log("cloudflare", CLOUDFLARE);
 * ```
 *
 * @module
 */

// deno-lint-ignore no-explicit-any
const g = globalThis as any;
export const BUN = g.Bun !== undefined;
export const DENO = g.Deno !== undefined;
export const NODELIKE = g.process !== undefined;
export const NODE = !BUN && NODELIKE;

export const CLOUDFLARE: boolean = g.navigator && g.navigator.userAgent &&
    g.navigator.userAgent.includes("Cloudflare-Workers");

export const BROWSER = g.window !== undefined && !NODELIKE && !DENO && !CLOUDFLARE;
export type Runtimes = "bun" | "deno" | "node" | "browser" | "cloudflare" | "unknown";

let runtimeName: Runtimes = "unknown";
let version = "";
let nodeVersion = "";
if (BUN) {
    runtimeName = "bun";
    version = g.Bun.version;
    nodeVersion = g.process.versions.node;
} else if (DENO) {
    runtimeName = "deno";
    version = g.Deno.version.deno;
} else if (CLOUDFLARE) {
    runtimeName = "cloudflare";
} else if (NODE) {
    runtimeName = "node";
    nodeVersion = g.process.versions.node;
    version = nodeVersion;
} else if (BROWSER) {
    runtimeName = "browser";
} else {
    runtimeName = "unknown";
}

export const VERSION = version;
export const NODE_VERSION = nodeVersion;
export const RUNTIME: Runtimes = runtimeName;
