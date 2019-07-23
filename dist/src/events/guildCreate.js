"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Event_1 = require("./Event");
exports.event = new Event_1.Event("guildCreate", async (bot, g) => {
    try {
        const embed = new discord_js_1.RichEmbed({
            description: "Thank You for adding Lifegaurd to your server! To begin using Lifeguard, run !setup"
        });
        g.defaultChannel.send(embed);
    }
    catch (err) {
        return {
            location: "GuildCreate Event",
            message: err
        };
    }
});
