"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Guild_1 = require("../models/Guild");
const Event_1 = require("./Event");
exports.event = new Event_1.Event("messageDelete", async (bot, msg) => {
    const lang = bot.langs["en-US"].events.messageDelete;
    try {
        const dbGuild = await Guild_1.findGuild(msg.guild.id);
        const embed = new discord_js_1.RichEmbed({
            description: bot.format(lang.log, {
                channel: `<#${msg.channel.id}>`,
                id: msg.member.id,
                name: `<@${msg.member.id}>`
            })
        });
        embed.setTimestamp();
        if (!msg.author.bot) {
            if (dbGuild) {
                const modlog = msg.guild.channels.get(dbGuild.modLog);
                if (modlog) {
                    modlog.send(embed);
                }
            }
        }
    }
    catch (err) {
        return {
            location: "messageDelete Event",
            message: err
        };
    }
});
