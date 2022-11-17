"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.symnode = void 0;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
/**
 * Symnode class
 * Symbolic link utility class for cli
 *
 * @export
 * @class symnode
 */
class symnode {
    /**
     * Creates an instance of symnode.
     *
     * @memberOf symnode
     */
    constructor() {
        this.remove = false;
        if (this.admin_required()) {
            if (!this.admin_running())
                this.exit('Administrator/Elevated shell privileges are required');
        }
        this.args_parse();
    }
    /**
     * Utility for displaying error messages. Followed by the termination of the process with the applicable error code
     *
     * @private
     * @param {string} [message='ERROR'] The error message to be displayed
     * @param {number} [exitCode=9] The applicable error code reflecting the process termination
     *
     * @memberOf symnode
     */
    exit(message = 'ERROR', exitCode = 9) {
        console.error(message);
        process.exitCode = exitCode;
        process.exit();
    }
    /**
     * Check to see if administrator/super user privilages are required
     *
     * @private
     * @returns {boolean}
     *
     * @memberOf symnode
     */
    admin_required() {
        return process.platform === 'win32';
    }
    /**
     * Check to see if the shell is being executed with administrator/super user privilages
     *
     * @private
     * @returns {boolean} Returns true if running under administrator/super user privilages
     *
     * @memberOf symnode
     */
    admin_running() {
        if (process.platform !== 'win32')
            return !!process.env.SUDO_UID;
        try {
            (0, child_process_1.execFileSync)("net", ["session"], { "stdio": "ignore" });
            return true;
        }
        catch (err) {
            return false;
        }
    }
    /**
     * Parsing and processing of the cli arguments
     *
     * @private
     *
     * @memberOf symnode
     */
    args_parse() {
        let use_prev = false;
        let prev;
        process.argv.forEach((arg) => {
            let switch_arg = (use_prev) ? prev : arg;
            switch (switch_arg) {
                case '-h':
                case '--help':
                    this.help();
                    break;
                case '-s':
                case '--src':
                    if (use_prev) {
                        this.source = arg;
                        prev = undefined;
                        use_prev = false;
                    }
                    else {
                        prev = arg;
                        use_prev = true;
                    }
                    break;
                case '-d':
                case '--dest':
                    if (use_prev) {
                        this.destination = arg;
                        prev = undefined;
                        use_prev = false;
                    }
                    else {
                        prev = arg;
                        use_prev = true;
                    }
                    break;
                case '-r':
                case '--remove':
                    this.remove = true;
                    break;
            }
        });
        if ((this.remove && typeof this.destination === 'undefined') || (!this.remove && (typeof this.source === 'undefined' || typeof this.destination === 'undefined')))
            this.help();
    }
    /**
     * Helper text to be displayed
     *
     * @private
     *
     * @memberOf symnode
     */
    help() {
        console.log('SYMNODE ::: HELP');
        console.log('Required arguments');
        console.log('\t-s, --src\t\tThe source file/directory');
        console.log('\t-d, --dest\t\tThe destination file/directory');
        console.log('\t-h, --help\t\tDisplay the help information for SYMNODE');
        console.log('\n\nexample: node dist/index.js -s <path to source file/directory> -d <path to destination file/directory>');
        console.log('\n\nexample: node dist/index.js -r -d <path to file/directory to be removed>');
        process.exit();
    }
    /**
     * Utility for determining if the desired location exists
     *
     * @private
     * @param {string} loc The desired location
     * @returns {boolean} Returns true if the location exists
     *
     * @memberOf symnode
     */
    exists(loc) {
        return (0, fs_1.existsSync)(loc);
    }
    /**
     * Utility for determining if the desired location is a directory
     *
     * @private
     * @param {string} loc The desired location to be checked
     * @returns {boolean} Returns true if the location is a directory
     *
     * @memberOf symnode
     */
    is_dir(loc) {
        return (0, fs_1.lstatSync)(loc).isDirectory();
    }
    /**
     * Utility for determining if the desired location is a symbolic link
     *
     * @private
     * @param {string} loc Desired location to be checked
     * @returns {boolean} Returns true if the location is a symbolic link
     *
     * @memberOf symnode
     */
    is_symlink(loc) {
        return (0, fs_1.lstatSync)(loc).isSymbolicLink();
    }
    /**
     * Hander function for removal of directories and symlinks
     *
     * @private
     * @param {string} path
     *
     * @memberOf symnode
     */
    destroy_handling(path) {
        if (this.is_dir(path))
            (0, fs_1.rmdirSync)(path);
        else
            (0, fs_1.unlinkSync)(path);
    }
    /**
     * Create a symbolic link from the source to the destination
     *
     * @returns {boolean} Returns true if symbolic link is created
     *
     * @memberOf symnode
     */
    link() {
        if (this.remove)
            this.exit('Running in removal mode.');
        try {
            if (this.is_dir(this.destination) || this.is_symlink(this.destination))
                this.destroy_handling(this.destination);
            (0, fs_1.symlinkSync)(this.source, this.destination, 'dir');
        }
        catch (err) {
            this.exit(err);
            return false;
        }
        if (!this.is_symlink(this.destination))
            return false;
        return true;
    }
    /**
     * Destroy the destination file/folder
     *
     * @returns {boolean} Returns true if successful
     *
     * @memberOf symnode
     */
    destroy() {
        if (!this.remove)
            this.exit('You are not running in removal mode.');
        this.destroy_handling(this.destination);
        return !this.exists(this.destination);
    }
    /**
     * Returns if you are running in removal mode or not
     *
     * @returns {boolean} Returns true if in removal mode
     *
     * @memberOf symnode
     */
    remove_mode() {
        return this.remove;
    }
}
exports.symnode = symnode;
