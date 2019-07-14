"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(name, func, options) {
        this.name = name;
        this.func = func;
        this.options = options;
    }
}
exports.Command = Command;
