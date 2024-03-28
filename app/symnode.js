import { execFileSync } from "child_process"
import { exit_codes, platforms } from "./lib/enums.js"
import { existsSync, lstatSync, mkdirSync, rmdirSync, symlinkSync, unlinkSync } from "fs"
import { isAbsolute, resolve } from "path"

export class symnode {
    /**
     * The source location to be used for the symbolic link (if applicable).
     *
     * @private
     * @type string | undefined
     */
    #source
    /**
     * The destination location to be used for the symbolic link.
     *
     * @private
     * @type string | undefined
     */
    #destination
    /**
     * A flag for tracking if you are in removeal mode. Default ***false***.
     *
     *
     * @private
     * @type boolean
     */
    #remove
    /**
     * A flag for if the source location is a file rather then a directory.
     * Default handling is to assume that the source is a directory.
     * Default value is ***false***.
     *
     * @private
     * @type boolean
     */
    #file_link

    /**
     * Create a new instance of symnode.
     * @constructor
     */
    constructor() {
        this.#file_link = false
        this.#remove = false
        if (this.admin_required() && !this.is_admin()) {
            this.exit(
                "Super user shell privileges are required",
                exit_codes.fatal
            )
        }
        this._args_parse()
        // INFO: Convert source and dest to absolute paths
        if (undefined !== this.#source) {
            this.#source = this._to_absolute(this.#source)
        }

        if (undefined !== this.#destination) {
            this.#destination = this._to_absolute(this.#destination)
        }
    }

    /**
     * Is admin privileges required?
     *
     * @public
     * @returns {boolean}
     */
    admin_required() {
        return platforms.WINDOWS === process.platform
    }

    /**
     * Is the shell/terminal running with super user privileges
     *
     * @public
     * @returns {boolean}
     */
    is_admin() {
        if (platforms.WINDOWS === process.platform) {
            return !!process.env["SUDO_UID"]
        }

        try {
            execFileSync("net", ["session"], { "stdio": "ignore" })
            return true
        } catch (err) {
            return false
        }
    }

    /**
     * Exiting the application
     *
     * @public
     * @param {string|undefined} message The message to be displayed for the error.
     * @param {number} [exit_code=exit_codes.normal] The exit code. Default: `exit_codes.normal`
     * @see {@link exit_codes}.
     */
    exit(message, exit_code = exit_codes.normal) {
        if (undefined !== message) {
            console.error(message)
        }
        process.exitCode = exit_code
        process.exit()
    }

    /**
     * Parsing and processing of the cli args
     *
     * @protected
     */
    _args_parse() {
        /** @type {boolean} */
        let use_prev = false
        /** @type {string | undefined} */
        let prev = undefined

        for (let i = 0; i < process.argv.length; i++) {
            /** @type {string} */
            let switch_arg = process.argv[i]

            if (use_prev && undefined !== prev) {
                switch_arg = prev
            }

            switch (switch_arg) {
                case "-h":
                case "--help":
                    this._help()
                    break
                case "-s":
                case "--src":
                    if (use_prev) {
                        this.#source = process.argv[i]
                        prev = undefined
                        use_prev = false
                    } else {
                        prev = process.argv[i]
                        use_prev = true
                    }
                    break
                case "-d":
                case "--dest":
                    if (use_prev) {
                        this.#destination = process.argv[i]
                        prev = undefined
                        use_prev = false
                    } else {
                        prev = process.argv[i]
                        use_prev = true
                    }
                    break
                case "-r":
                case "--remove":
                    this.#remove = true
                    break
                case "-f":
                case "--file":
                    this.#file_link = true
                    break
            }
        }
    }

    /**
     * Helper text to be displayed
     *
     * @protected
     */
    _help() {
        console.log("SYMNODE ::: HELP")
        console.log("Required arguments")
        console.log("\t-s, --src\t\tThe source file/directory")
        console.log("\t-d, --dest\t\tThe destination file/directory")
        console.log("\t-r, --remove\t\tRemove the desired symlink")
        console.log("\t-f, --file\t\tThe symlink to be created is for a file")
        console.log("\t-h, --help\t\tDisplay the help information for SYMNODE")
        console.log("\n\nexample: node dist/index.js -s <path to source file/directory> -d <path to destination file/directory>")
        console.log("\n\nexample: node dist/index.js -r -d <path to file/directory to be removed>")
        this.exit()
    }

    /**
     * Does the desired path exist?
     *
     * @protected
     * @param {string} path The desired path
     * @returns {boolean}
     */
    _exists(path) {
        return existsSync(path)
    }

    /**
     * Does the path point to a directory?
     *
     * @public
     * @param {string} path The desired path to check
     * @returns {boolean}
     */
    is_dir(path) {
        return lstatSync(path).isDirectory()
    }

    /**
     * Does the path point to a file?
     *
     * @public
     * @param {string} path The desired path to check
     * @returns {boolean}
     */
    is_file(path) {
        return lstatSync(path).isFile()
    }

    /**
     * Does the path point to a symbolic link?
     *
     * @public
     * @param {string} path The desired path to check
     * @returns {boolean}
     */
    is_symlink(path) {
        return lstatSync(path).isSymbolicLink()
    }

    /**
     * Removal of a directory or symbolic link
     *
     * @protected
     * @param {string} path The desired path to remove
     * @todo Implement a boolean return flag
     */
    _dir_sym_remove(path) {
        if (this.is_dir(path)) {
            rmdirSync(path)
            return
        }

        if (this.is_symlink(path)) {
            unlinkSync(path)
            return
        }
    }

    /**
     * Generation of the destination path if the structs in the desired path are missing
     *
     * @protected
     */
    _dest_path_gen() {
        if (
            undefined !== this.#destination &&
            !existsSync(this.#destination)
        ) {
            const path_arr = this.#destination.split("/")
            path_arr.pop()
            mkdirSync(path_arr.join("/"), { recursive: true })
        }
    }

    /**
     * Convert a path to an absolute path
     *
     * @protected
     * @param {string} path The path to be converted to an absolute path
     * @returns {string} The absolute path
     */
    _to_absolute(path) {
        if (isAbsolute(path)) {
            return path
        }

        return resolve(path)
    }

    /**
     * Create a symbolic link from the source to the destination.
     *
     * @public
     * @returns {boolean}
     */
    link() {
        if (this.#remove) {
            this.exit(
                "Linking not allowed. You are in remove mode",
                exit_codes.invalid_arg
            )
        }

        if (
            undefined === this.#destination ||
            undefined === this.#source
        ) {
            return false
        }

        if (
            !this.is_dir(this.#source) &&
            !this.is_file(this.#source) &&
            !this.is_symlink(this.#source)
        ) {
            this.exit(
                `The source path is not valid: ${this.#source}`,
                exit_codes.invalid_arg
            )
        }

        this._dest_path_gen()
        if (this.#file_link) {
            // INFO: This is linking for a file
            if (
                !this.is_file(this.#source) &&
                !this.is_symlink(this.#source)
            ) {
                this.exit(
                    `The source is not pointing to a file: ${this.#source}`,
                    exit_codes.invalid_arg
                )
            }

            symlinkSync(this.#source, this.#destination, "file")

            if (!this.is_symlink(this.#destination)) {
                return false
            }
        } else {
            // INFO: This is linking for a directory
            if (
                !this.is_dir(this.#source) &&
                !this.is_symlink(this.#source)
            ) {
                this.exit(
                    `The source is not pointing to a directory: ${this.#source}`,
                    exit_codes.invalid_arg
                )
            }

            symlinkSync(this.#source, this.#destination, "dir")

            if (!this.is_symlink(this.#destination)) {
                return false
            }
        }

        return true
    }

    /**
     * Removal of the destination item.
     * Only acts on directories and symlinks
     *
     * @public
     * @returns {boolean}
     */
    destroy() {
        if (undefined === this.#destination) {
            return false
        }

        if (!this.#remove) {
            this.exit("You are not in removal mode!", exit_codes.fatal)
        }

        this._dir_sym_remove(this.#destination)
        return !this._exists(this.#destination)
    }

    /**
     * Is remove enabled?
     *
     * @public
     * @returns {boolean}
     */
    get is_remove() {
        return this.#remove
    }

    /**
     * The configured source location
     *
     * @returns {string | undefined}
     */
    get source_get() {
        return this.#source
    }

    /**
     * The configured destination location
     *
     * @returns {string | undefined}
     */
    get destination_get() {
        return this.#destination
    }

    /**
     * Set the configured source
     *
     * @public
     * @param {string} path
     */
    set source_set(path) {
        this.#source = path
    }

    /**
     * Set the configured destination
     *
     * @public
     * @param {string} path
     */
    set destination_set(path) {
        this.#destination = path
    }
}
