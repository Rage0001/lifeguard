"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Guild_1 = require("../models/Guild");
const Event_1 = require("./Event");
exports.event = new Event_1.Event("lifeguardCommandUsed", async (bot, msg, command) => {
    const lang = bot.langs["en-US"].events.lifeguardCommandUsed;
    try {
        const dbGuild = await Guild_1.findGuild(msg.guild.id);
        const embed = new discord_js_1.RichEmbed({
            description: bot.format(lang.log, {
                channel: `<#${msg.channel.id}>`,
                command: command.name,
                content: msg.content,
                id: msg.member.id,
                name: `<@${msg.member.id}>`
            })
        });
        embed.setTimestamp();
        if (dbGuild) {
            const modlog = msg.guild.channels.get(dbGuild.modLog);
            if (modlog) {
                modlog.send(embed);
            }
        }
    }
    catch (err) {
        return {
            location: "lifeguardCommandUsed Event",
            message: err
        };
    }
});
