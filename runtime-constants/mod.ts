/**
 * JavaScript runtime detection which is useful for writing
 * compatability layers in modules for different runtimes.
 *
 * ## Basic Usage
 *
 * ```typescript
 * import { RUNTIME, BUN, DENO, NODE, BROWSER } from "@gnome/runtime-constants";
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
/**
 * Returns true if the runtime is `bun`, otherwise, `false`.
 */
export const BUN = g.Bun !== undefined;

/**
 * Returns true if the runtime is `deno`, otherwise, `false`.
 */
export const DENO = g.Deno !== undefined;
/**
 * Returns true if the runtime is node-like like `node` or `bun`, otherwise, `false`.
 */
export const NODELIKE = g.process !== undefined;
/**
 * Returns true if the runtime is `node`, otherwise, `false`.
 */
export const NODE = !BUN && NODELIKE;

/**
 * Returns `true` if the runtime is `cloudflare`, otherwise, `false`.
 */
export const CLOUDFLARE: boolean = g.navigator && g.navigator.userAgent &&
    g.navigator.userAgent.includes("Cloudflare-Workers");

/**
 * Returns `true` if the runtime is a  `browser`, otherwise, `false`.
 */
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

/**
 * The runtime version.
 */
export const VERSION = version;
/**
 * The node version if the runtime is `node`, otherwise, an empty string.
 */
export const NODE_VERSION = nodeVersion;
/**
 * The runtime name: `bun`, `deno`, `node`, `browser`, `cloudflare`, or `unknown`.
 */
export const RUNTIME: Runtimes = runtimeName;
