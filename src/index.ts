import { symnode } from "./symnode"

let app = new symnode()
if (app.remove_mode())
    app.destroy()
else
    app.link()
process.exit(0)