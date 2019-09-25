"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Guild_1 = require("../models/Guild");
const Event_1 = require("./Event");
exports.event = new Event_1.Event("guildMemberRemove", async (bot, member) => {
    const lang = bot.langs["en-US"].events.guildMemberRemove;
    try {
        const dbGuild = await Guild_1.findGuild(member.guild.id);
        const embed = new discord_js_1.RichEmbed({
            description: bot.format(lang.log, {
                id: member.id,
                name: `<@${member.id}>`
            })
        });
        embed.setTimestamp();
        if (dbGuild) {
            const modlog = member.guild.channels.get(dbGuild.modLog);
            if (modlog) {
                modlog.send(embed);
            }
        }
    }
    catch (err) {
        return {
            location: "guildMemberRemove Event",
            message: err
        };
    }
});
