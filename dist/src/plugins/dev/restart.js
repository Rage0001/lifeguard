"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("../Command");
exports.command = new Command_1.Command("restart", async (msg, args, bot) => {
    const lang = bot.langs["en-US"].commands.restart;
    const embed = new discord_js_1.RichEmbed({
        description: lang.restart,
        title: lang.title
    });
    embed.setTimestamp();
    msg.channel.send(embed).then(() => {
        bot.restart(msg.channel.id);
    });
}, {
    guildOnly: true,
    hidden: true,
    level: 5,
    usage: ["restart"]
});
