"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Formatter_1 = require("./Formatter");
const Logger_1 = __importDefault(require("./Logger"));
// @ts-ignore
class PluginClient extends discord_js_1.Client {
    constructor(prefix, options) {
        super(options);
        this.prefix = prefix;
        this.options = options;
        this.logger = Logger_1.default;
        this.langs = {};
        this.format = Formatter_1.formatter;
        this.pendingEvents = [];
    }
    restart(channelID) {
        this.shard.send(["restart", channelID]);
        if (process.send) {
            process.send(["restart", channelID]);
        }
    }
    addEvent(event) {
        this.pendingEvents.push(event);
    }
    removeEvent(event) {
        this.pendingEvents = this.pendingEvents.filter(e => e !== event);
    }
}
exports.PluginClient = PluginClient;
