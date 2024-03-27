import { exit_codes } from "./app/lib/enums.js"
import { symnode } from "./app/symnode.js"

const app = new symnode()

if (app.is_remove) {
    app.destroy()
} else {
    if (!app.link()) {
        app.exit(
            `Failed to create the link from ${app.source_get} to ${app.destination_get}`,
            exit_codes.fatal
        )
    }
}

app.exit()
