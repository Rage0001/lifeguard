"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Guild_1 = require("../models/Guild");
const Event_1 = require("./Event");
exports.event = new Event_1.Event("messageDeleteBulk", async (bot, msgs) => {
    const lang = bot.langs["en-US"].events.messageDeleteBulk;
    try {
        const msg = msgs.array()[0];
        const pendingEvent = bot.pendingEvents
            .filter(e => e.event === "messageDeleteBulk")
            .find(e => e.args[1] === msg.guild.id);
        const dbGuild = await Guild_1.findGuild(msg.guild.id);
        const embed = new discord_js_1.RichEmbed({
            description: bot.format(lang.default, {
                channel: `<#${msg.channel.id}>`,
                count: `${msgs.size}`
            })
        });
        embed.setTimestamp();
        if (pendingEvent) {
            embed.setDescription(bot.format(lang.log, {
                channel: `<#${msg.channel.id}>`,
                count: `${msgs.size}`,
                mod: `<@${pendingEvent.args[0]}>`,
                modID: pendingEvent.args[0]
            }));
            bot.removeEvent(pendingEvent);
        }
        if (dbGuild) {
            const modlog = msg.guild.channels.get(dbGuild.modLog);
            if (modlog) {
                modlog.send(embed);
            }
        }
    }
    catch (err) {
        return {
            location: "messageDeleteBulk Event",
            message: err
        };
    }
});
