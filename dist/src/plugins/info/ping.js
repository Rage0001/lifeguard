"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("../Command");
exports.command = new Command_1.Command("ping", async (msg, args, bot) => {
    const lang = bot.langs["en-US"].commands.ping;
    const message = await msg.channel.send("Ping?");
    if (!Array.isArray(message)) {
        const embed = new discord_js_1.RichEmbed({
            description: bot.format(lang.body, {
                latency: `${Math.round(bot.ping)}`,
                ping: `${message.createdTimestamp - msg.createdTimestamp}`
            }),
            title: ":ping_pong:"
        });
        message.edit("", embed);
    }
}, {
    guildOnly: true,
    hidden: false,
    level: 0,
    usage: ["ping"]
});
