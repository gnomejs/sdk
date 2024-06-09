import type { Env } from "../types.d.ts";
import { EnvBase } from "../base/mod.ts";



/**
 * Represents the environment variables and provides methods to interact with them.
 */
class MemoryEnv extends EnvBase {
    
    constructor() {
       super();
    }
}

export const env: Env = new MemoryEnv();
