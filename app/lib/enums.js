/**
 * Platforms enum
 *
 * @readonly
 * @constant
 * @exports platforms
 * @enum {string}
 */
export const platforms = {
    /**
     * AIX
     * @returns "aix"
     */
    AIX: "aix",
    /**
     * MacOS
     * @returns "darwin"
     */
    MAC_OS: "darwin",
    /**
     * Free BSD
     * @returns "freebsd"
     */
    FREEBSD: "freebsd",
    /**
     * Linux
     * @returns "linux"
     */
    LINUX: "linux",
    /**
     * Open BSD
     * @returns "openbsd"
     */
    OPENBSD: "openbsd",
    /**
     * Sun OS
     * @returns "sunos"
     */
    SUNOS: "sunos",
    /**
     * Windows
     * @returns "win32"
     */
    WINDOWS: "win32"
}

/**
 * Exit code enum
 *
 * @readonly
 * @constant
 * @exports exit_codes
 * @enum {number}
 */
export const exit_codes = {
    /** @returns 0  */
    normal: 0,
    /** @returns 5  */
    fatal: 5,
    /** @returns 6  */
    non_fn_internal_handler: 6,
    /** @returns 9  */
    invalid_arg: 9,
    /** @returns 12  */
    invalid_debug: 12,
    /** @returns 13  */
    unfinised_await: 13,
    /** @returns 14  */
    snapshot_failed: 14
}
