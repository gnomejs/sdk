import process from "node:process";
import type { Env } from "../types.d.ts";
import { DefaultEnvPath, EnvBase } from "../base/mod.ts";
const proc = process;

if (!proc) {
    throw new Error("The process global variable is not available.");
}

class NodeEnv extends EnvBase {
    protected override init(): void {
        super.proxy = proc.env;
        super.path = new DefaultEnvPath(this);
    }

    override get(name: string): string | undefined {
        return proc.env[name];
    }

    override set(name: string, value: string): this {
        proc.env[name] = value;
        return this;
    }

    override has(name: string): boolean {
        const value = proc.env[name];
        return value !== undefined && value !== null;
    }

    override remove(name: string): this {
        delete proc.env[name];
        return this;
    }

    override toObject(): Record<string, string | undefined> {
        return Object.assign({}, proc.env);
    }
}

export const env: Env = new NodeEnv();
