import { execFileSync } from "child_process"
import { existsSync, lstatSync, rmdirSync, symlinkSync, unlinkSync } from "fs";

export class symnode {
    private source: string | undefined;
    private destination: string | undefined;
    private remove: boolean 

    constructor() {
        this.remove = false
        if (this.admin_required()) {
            if (!this.admin_running())
                this.exit('Administrator/Elevated shell privileges are required')
        }
        this.args_parse()
    }

    private exit(message: string = 'ERROR', exitCode: number = 9): void {
        console.error(message)
        process.exitCode = exitCode
        process.exit()
    }

    private admin_required(): boolean {
        return process.platform === 'win32'
    }

    private admin_running(): boolean {
        if (process.platform !== 'win32')
            return !!process.env.SUDO_UID
        try {
            execFileSync("net", ["session"], { "stdio": "ignore" })
            return true
        } catch (err) {
            return false
        }
    }

    private args_parse(): void {
        process.argv.forEach((arg: string) => {
            let arg_split: string[] = arg.split('=')
            if (arg_split.length === 2) {
                switch (arg_split[0]) {
                    case '-h':
                    case '--help':
                        this.help()
                        break
                    case '-s':
                    case '--src':
                        this.source = arg_split[1]
                        break
                    case '-d':
                    case '--dest':
                        this.destination = arg_split[1]
                        break
                    case '-r':
                    case '--remove':
                        this.remove = true
                        break
                }
            }
        })
        if ((this.remove && typeof this.destination === 'undefined') || (!this.remove && (typeof this.source === 'undefined' || typeof this.destination === 'undefined')))
            this.help()
    }

    private help(): void {
        console.log('SYMNODE ::: HELP')
        console.log('Required arguments')
        console.log('\t-s, --src\t\tThe source file/directory')
        console.log('\t-d, --dest\t\tThe destination file/directory')
        console.log('\t-h, --help\t\tDisplay the help information for SYMNODE')
        console.log('\n\nexample: node dist/index.js -s=<path to source file/directory> -d=<path to destination file/directory>')
        console.log('\n\nexample: node dist/index.js -r -d=<path to file/directory to be removed>')
        process.exit()
    }

    private exists(loc: string): boolean {
        return existsSync(loc)
    }

    private is_dir(loc: string): boolean {
        return lstatSync(loc).isDirectory()
    }

    private is_symlink(loc: string): boolean {
        return lstatSync(loc).isSymbolicLink()
    }

    public link(): boolean {
        if (this.remove)
            this.exit('Running in removal mode.')
        try {
            symlinkSync(this.source, this.destination, 'dir')
        } catch (err) {
            this.exit(err)
            return false
        }
        if (!this.is_symlink(this.destination))
            return false
        return true
    }

    public destroy(): boolean {
        if (!this.remove)
            this.exit('You are not running in removal mode.')
        if (this.is_dir(this.destination))
            rmdirSync(this.destination)
        else
            unlinkSync(this.destination)
        return !this.exists(this.destination)
    }

    public remove_mode(): boolean {
        return this.remove
    }
}