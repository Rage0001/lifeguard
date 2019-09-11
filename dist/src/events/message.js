"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calcLevel_1 = require("../helpers/calcLevel");
const Guild_1 = require("../models/Guild");
const User_1 = require("../models/User");
const Event_1 = require("./Event");
exports.event = new Event_1.Event("message", async (bot, msg) => {
    try {
        const user = await User_1.findUser(msg.author.id);
        const guildConfig = await Guild_1.findGuild(msg.guild.id);
        if (user) {
            if (msg.content.startsWith(bot.prefix)) {
                const split = msg.content.split(" ");
                const name = split[0].slice(bot.prefix.length);
                split.shift();
                const args = split;
                const plugin = bot.plugins.find(plugin => plugin.commands.has(name));
                if (plugin) {
                    const cmd = plugin.commands.get(name);
                    if (cmd) {
                        if (!cmd.options.guildOnly) {
                            const level = await calcLevel_1.calcLevel(msg.member, msg.guild);
                            if (level >= cmd.options.level) {
                                cmd.func(msg, args, bot, guildConfig);
                            }
                        }
                        else {
                            cmd.func(msg, args, bot);
                        }
                    }
                }
            }
            else {
                return;
            }
        }
        else {
            User_1.createUser({
                id: msg.author.id,
                infractions: [],
                reminders: []
            });
        }
    }
    catch (err) {
        return {
            location: "Message Event",
            message: err
        };
    }
});
