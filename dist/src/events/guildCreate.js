"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Guild_1 = require("../models/Guild");
const Event_1 = require("./Event");
exports.event = new Event_1.Event("guildCreate", async (bot, guild) => {
    const lang = bot.langs["en-US"].events.guildCreate;
    try {
        await Guild_1.createGuild({
            id: guild.id,
            starboard: []
        });
        const embed = new discord_js_1.RichEmbed({
            description: bot.format(lang, {
                id: guild.id,
            })
        });
        guild.systemChannel.send(embed);
    }
    catch (err) {
        return {
            location: "GuildCreate Event",
            message: err
        };
    }
});
