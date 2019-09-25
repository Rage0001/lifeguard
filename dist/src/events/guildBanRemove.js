"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Guild_1 = require("../models/Guild");
const Event_1 = require("./Event");
exports.event = new Event_1.Event("guildBanRemove", async (bot, guild, user) => {
    const lang = bot.langs["en-US"].events.guildBanRemove;
    try {
        const dbGuild = await Guild_1.findGuild(guild.id);
        const embed = new discord_js_1.RichEmbed({
            description: bot.format(lang.log, {
                id: user.id,
                name: `<@${user.id}>`
            }),
            title: lang.title
        });
        embed.setTimestamp();
        if (dbGuild) {
            const modlog = guild.channels.get(dbGuild.modLog);
            if (modlog) {
                modlog.send(embed);
            }
        }
    }
    catch (err) {
        return {
            location: "GuildBanRemove Event",
            message: err
        };
    }
});
