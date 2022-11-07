import { execFileSync } from "child_process"

export class symnode {
    private source: string;
    private destination: string;

    constructor() {
        if (this.admin_required()) {
            if (!this.admin_running())
                this.exit('Administrator/Elevated shell privileges are required')
        }
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

    }
}