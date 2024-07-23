import { env } from "./mod.ts";
export type AppEnv = "development" | "staging" | "production" | "test" | "qa" | "uat";

/**
 * Indicates whether debugging mode is enabled.
 */
let DEBUG: boolean = env.defaultBool("DEBUG", false);

/**
 * Indicates whether tracing is enabled.
 */
let TRACE: boolean = env.defaultBool("TRACE", false);

/**
 * The current application environment.
 * Can be either an `AppEnv` type or a string representing the environment.
 *
 * The default value is `development`.
 *
 * The environment can be set using the following environment variables:
 * - `NODE_ENV`
 * - `DENO_ENV`
 * - `APP_ENV`
 */
let APP_ENV: AppEnv | string = "development";

if (env.has("NODE_ENV")) {
    APP_ENV = env.get("NODE_ENV") as AppEnv;
} else if (env.has("DENO_ENV")) {
    APP_ENV = env.get("DENO_ENV") as AppEnv;
} else if (env.has("APP_ENV")) {
    APP_ENV = env.get("APP_ENV") as AppEnv;
}

/**
 * Sets the debug mode.
 * @param debug - A boolean value indicating whether to enable or disable debug mode.
 * @returns void
 */
export function setDebug(debug: boolean): void {
    DEBUG = debug;
}

/**
 * Sets the trace flag to enable or disable tracing.
 * @param trace - A boolean value indicating whether tracing should be enabled or disabled.
 * @returns void
 */
export function setTrace(trace: boolean): void {
    TRACE = trace;
}

/**
 * Sets the application environment.
 * @param {AppEnv | string} appEnv - The application environment to set.
 * @returns {void}
 */
export function setAppEnv(appEnv: AppEnv | string): void {
    APP_ENV = appEnv;
}

/**
 * Retrieves the application environment.
 * @returns {AppEnv | string} The application environment.
 */
export function getAppEnv(): AppEnv | string {
    return APP_ENV;
}

/**
 * Checks if the application is running in debug mode.
 * @returns {boolean} Returns `true` if the application is running in debug mode, `false` otherwise.
 */
export function isDebug(): boolean {
    return DEBUG;
}

/**
 * Checks if the trace flag is enabled.
 * @returns {boolean} Returns `true` if the trace flag is enabled, `false` otherwise.
 */
export function isTrace(): boolean {
    return TRACE;
}

/**
 * Checks if the application is running in a production environment.
 * @returns {boolean} Returns true if the application is in production, false otherwise.
 */
export function isProduction(): boolean {
    return APP_ENV === "production" || APP_ENV === "prod" || APP_ENV.includes("prod");
}

/**
 * Checks if the application is running in a development environment.
 * @returns {boolean} Returns true if the application is in development mode, false otherwise.
 */
export function isDevelopment(): boolean {
    return APP_ENV === "development" || APP_ENV === "dev" || APP_ENV.includes("dev");
}

/**
 * Checks if the current application environment is a test environment.
 * @returns {boolean} Returns `true` if the current environment is a test environment, otherwise `false`.
 */
export function isTest(): boolean {
    return APP_ENV === "test" || APP_ENV.includes("test");
}

/**
 * Checks if the current application environment is staging.
 * @returns {boolean} Returns true if the application environment is staging, false otherwise.
 */
export function isStaging(): boolean {
    return APP_ENV === "staging" || APP_ENV.includes("stag");
}

/**
 * Checks if the current application environment is set to QA.
 * @returns {boolean} Returns true if the application environment is QA, otherwise false.
 */
export function isQA(): boolean {
    return APP_ENV === "qa" || APP_ENV.includes("qa");
}

/**
 * Checks if the current application environment is UAT (User Acceptance Testing).
 * @returns {boolean} Returns true if the application environment is UAT, otherwise returns false.
 */
export function isUAT(): boolean {
    return APP_ENV === "uat" || APP_ENV.includes("uat");
}

export { APP_ENV, DEBUG, TRACE };
