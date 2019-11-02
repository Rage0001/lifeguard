"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Store_1 = require("../helpers/Store");
class Command {
    constructor(name, func, options) {
        this.name = name;
        this.func = func;
        this.options = options;
        this.subcommands = new Store_1.Store();
    }
    addSubcommand(name, cmd) {
        this.subcommands.set(name, cmd);
    }
}
exports.Command = Command;
