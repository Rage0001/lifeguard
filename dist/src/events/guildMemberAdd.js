"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const moment_1 = __importDefault(require("moment"));
const Guild_1 = require("../models/Guild");
const Event_1 = require("./Event");
exports.event = new Event_1.Event("guildMemberAdd", async (bot, member) => {
    const lang = bot.langs["en-US"].events.guildMemberAdd;
    try {
        const dbGuild = await Guild_1.findGuild(member.guild.id);
        const embed = new discord_js_1.RichEmbed({
            description: bot.format(lang.log, {
                createdAt: `${moment_1.default(member.user.createdTimestamp).fromNow()}`,
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
            location: "guildMemberAdd Event",
            message: err
        };
    }
});
