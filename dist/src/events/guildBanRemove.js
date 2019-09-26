"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Guild_1 = require("../models/Guild");
const Event_1 = require("./Event");
exports.event = new Event_1.Event("guildBanRemove", async (bot, guild, user) => {
    const lang = bot.langs["en-US"].events.guildBanRemove;
    try {
        const pendingEvent = bot.pendingEvents
            .filter(e => e.event === "guildBanRemove")
            .filter(e => e.args[3] === guild.id)
            .find(e => e.args[0] === user.id);
        const dbGuild = await Guild_1.findGuild(guild.id);
        const embed = new discord_js_1.RichEmbed();
        embed.setTimestamp();
        if (pendingEvent) {
            embed.setDescription(bot.format(lang.log, {
                id: pendingEvent.args[0],
                mod: `<@${pendingEvent.args[1]}>`,
                modID: pendingEvent.args[1],
                name: `<@${pendingEvent.args[0]}>`,
                reason: `${pendingEvent.args[2]}`
            }));
            bot.removeEvent(pendingEvent);
        }
        else {
            embed.setDescription(bot.format(lang.default, {
                id: user.id,
                name: `<@${user.id}>`
            }));
        }
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
