import { PATH_SEP, WINDOWS } from "@gnome/os-constants";

export { PATH_SEP, WINDOWS };

/**
 * Represents the environment PATH variable name.
 */
export const PATH = WINDOWS ? "Path" : "PATH";

/**
 * Represents the environment HOME variable name.
 */
export const HOME = WINDOWS ? "USERPROFILE" : "HOME";

/**
 * Represents the environment USER variable name.
 */
export const USER = WINDOWS ? "USERNAME" : "USER";

/**
 * Represents the environment TEMP variable name.
 */
export const TMP = WINDOWS ? "TEMP" : "TMPDIR";

/**
 * Represents the environment HOSTNAME variable name.
 */
export const HOSTNAME = WINDOWS ? "COMPUTERNAME" : "HOSTNAME";

/**
 * Represents the environment HOME data directory name
 * which is `APPDATA` on windows and `XDG_DATA_HOME` on
 * some systems.
 */
export const HOME_DATA_DIR = WINDOWS ? "AppData" : "XDG_DATA_HOME";

/**
 * Represents the environment HOME config directory name
 * which is `APPDATA` on windows and `XDG_CONFIG_HOME` on
 * some systems.
 */
export const HOME_CONFIG_DIR = WINDOWS ? "AppData" : "XDG_CONFIG_HOME";

/**
 * Represents the environment HOME cache directory name
 * which is `LocalAppData` on windows and `XDG_CACHE_HOME`
 * on some systems.
 */
export const HOME_CACHE_DIR = WINDOWS ? "LocalAppData" : "XDG_CACHE_HOME";
