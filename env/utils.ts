import { env } from "./mod.ts";
export type AppEnv = "development" | "staging" | "production" | "test" | "qa" | "uat";

let DEBUG = env.defaultBool("DEBUG", false);
let TRACE = env.defaultBool("TRACE", false);
let APP_ENV: AppEnv | string = "development";

if (env.has("NODE_ENV")) {
    APP_ENV = env.get("NODE_ENV") as AppEnv;
} else if (env.has("DENO_ENV")) {
    APP_ENV = env.get("DENO_ENV") as AppEnv;
} else if (env.has("APP_ENV")) {
    APP_ENV = env.get("APP_ENV") as AppEnv;
}

export function setDebug(debug: boolean) {
    DEBUG = debug;
}

export function setTrace(trace: boolean) {
    TRACE = trace;
}

export function setAppEnv(appEnv: AppEnv | string) {
    APP_ENV = appEnv;
}

export function getAppEnv() {
    return APP_ENV;
}

export function isDebug() {
    return DEBUG;
}

export function isTrace() {
    return TRACE;
}

export function isProduction() {
    return APP_ENV === "production" || APP_ENV === "prod" || APP_ENV.includes("prod");
}

export function isDevelopment() {
    return APP_ENV === "development" || APP_ENV === "dev" || APP_ENV.includes("dev");
}

export function isTest() {
    return APP_ENV === "test" || APP_ENV.includes("test");
}

export function isStaging() {
    return APP_ENV === "staging" || APP_ENV.includes("stag");
}

export function isQA() {
    return APP_ENV === "qa" || APP_ENV.includes("qa");
}

export function isUAT() {
    return APP_ENV === "uat" || APP_ENV.includes("uat");
}

export { APP_ENV, DEBUG, TRACE };
