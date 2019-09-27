"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Guild_1 = require("../models/Guild");
const Event_1 = require("./Event");
exports.event = new Event_1.Event("messageUpdate", async (bot, old, newMsg) => {
    const lang = bot.langs["en-US"].events.messageUpdate;
    try {
        const dbGuild = await Guild_1.findGuild(old.guild.id);
        const embed = new discord_js_1.RichEmbed({
            description: bot.format(lang.log, {
                after: newMsg.content,
                before: old.content,
                channel: `<#${old.channel.id}>`,
                id: old.member.id,
                name: `<@${old.member.id}>`
            })
        });
        embed.setTimestamp();
        if (!old.author.bot) {
            if (dbGuild) {
                const modlog = old.guild.channels.get(dbGuild.modLog);
                if (modlog) {
                    modlog.send(embed);
                }
            }
        }
    }
    catch (err) {
        return {
            location: "messageUpdate Event",
            message: err
        };
    }
});
