"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("../private/config");
const Event_1 = require("./Event");
exports.event = new Event_1.Event("resume", async (bot) => {
    const lang = bot.langs["en-US"].events.resume;
    const embed = new discord_js_1.RichEmbed();
    embed.setTitle(lang.resume);
    embed.setColor("GREEN");
    const wsLog = await bot.channels.get(config_1.config.wsLogChannel);
    if (wsLog) {
        wsLog.send(embed);
    }
});
