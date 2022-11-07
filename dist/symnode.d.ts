/**
 * Symnode class
 * Symbolic link utility class for cli
 *
 * @export
 * @class symnode
 */
export declare class symnode {
    /**
     * The source location to be used for the symbolic link (if applicable)
     *
     * @private
     * @type {(string | undefined)}
     * @memberOf symnode
     */
    private source;
    /**
     * The desitination of the symbolic link, or the directory/folder that is to be removed
     *
     * @private
     * @type {(string | undefined)}
     * @memberOf symnode
     */
    private destination;
    /**
     * Flag for tracking if the process is running under removal mode or not
     *
     * @private
     * @type {boolean}
     * @memberOf symnode
     */
    private remove;
    /**
     * Creates an instance of symnode.
     *
     * @memberOf symnode
     */
    constructor();
    /**
     * Utility for displaying error messages. Followed by the termination of the process with the applicable error code
     *
     * @private
     * @param {string} [message='ERROR'] The error message to be displayed
     * @param {number} [exitCode=9] The applicable error code reflecting the process termination
     *
     * @memberOf symnode
     */
    private exit;
    /**
     * Check to see if administrator/super user privilages are required
     *
     * @private
     * @returns {boolean}
     *
     * @memberOf symnode
     */
    private admin_required;
    /**
     * Check to see if the shell is being executed with administrator/super user privilages
     *
     * @private
     * @returns {boolean} Returns true if running under administrator/super user privilages
     *
     * @memberOf symnode
     */
    private admin_running;
    /**
     * Parsing and processing of the cli arguments
     *
     * @private
     *
     * @memberOf symnode
     */
    private args_parse;
    /**
     * Helper text to be displayed
     *
     * @private
     *
     * @memberOf symnode
     */
    private help;
    /**
     * Utility for determining if the desired location exists
     *
     * @private
     * @param {string} loc The desired location
     * @returns {boolean} Returns true if the location exists
     *
     * @memberOf symnode
     */
    private exists;
    /**
     * Utility for determining if the desired location is a directory
     *
     * @private
     * @param {string} loc The desired location to be checked
     * @returns {boolean} Returns true if the location is a directory
     *
     * @memberOf symnode
     */
    private is_dir;
    /**
     * Utility for determining if the desired location is a symbolic link
     *
     * @private
     * @param {string} loc Desired location to be checked
     * @returns {boolean} Returns true if the location is a symbolic link
     *
     * @memberOf symnode
     */
    private is_symlink;
    /**
     * Create a symbolic link from the source to the destination
     *
     * @returns {boolean} Returns true if symbolic link is created
     *
     * @memberOf symnode
     */
    link(): boolean;
    /**
     * Destroy the destination file/folder
     *
     * @returns {boolean} Returns true if successful
     *
     * @memberOf symnode
     */
    destroy(): boolean;
    /**
     * Returns if you are running in removal mode or not
     *
     * @returns {boolean} Returns true if in removal mode
     *
     * @memberOf symnode
     */
    remove_mode(): boolean;
}
