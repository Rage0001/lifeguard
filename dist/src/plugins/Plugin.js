"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Store_1 = require("../helpers/Store");
class Plugin {
    constructor(name) {
        this.name = name;
        this.commands = new Store_1.Store();
    }
}
exports.Plugin = Plugin;
