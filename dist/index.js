"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const symnode_1 = require("./symnode");
let app = new symnode_1.symnode();
if (app.remove_mode())
    app.destroy();
else
    app.link();
process.exit(0);
