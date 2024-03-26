import { symnode } from "./symnode";
const app = new symnode();
if (app.remove_mode())
    app.destroy();
else
    app.link();
process.exit(0);
//# sourceMappingURL=index.js.map