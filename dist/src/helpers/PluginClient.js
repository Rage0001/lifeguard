"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Formatter_1 = require("./Formatter");
// @ts-ignore
class PluginClient extends discord_js_1.Client {
    constructor(prefix, options) {
        super(options);
        this.prefix = prefix;
        this.options = options;
        this.langs = {};
        this.format = Formatter_1.formatter;
    }
}
exports.PluginClient = PluginClient;
