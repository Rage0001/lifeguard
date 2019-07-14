"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calcLevel_1 = require("../helpers/calcLevel");
const Event_1 = require("./Event");
exports.event = new Event_1.Event("message", async (bot, msg) => {
    try {
        if (msg.content.startsWith(bot.prefix)) {
            const split = msg.content.split(" ");
            const name = split[0].slice(bot.prefix.length);
            split.shift();
            const args = split;
            const plugin = bot.plugins.find(plugin => plugin.commands.has(name));
            if (plugin) {
                const level = calcLevel_1.calcLevel(msg.member, msg.guild);
                const cmd = plugin.commands.get(name);
                if (cmd) {
                    if (level >= cmd.options.level) {
                        cmd.func(msg, args, bot);
                    }
                }
            }
        }
        else {
            return;
        }
    }
    catch (err) {
        return {
            location: "Message Event",
            message: err
        };
    }
});
