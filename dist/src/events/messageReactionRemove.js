"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Guild_1 = require("../models/Guild");
const Event_1 = require("./Event");
exports.event = new Event_1.Event("messageReactionRemove", async (bot, reaction, user) => {
    try {
        const lang = bot.langs["en-US"].starboard;
        const starboardEmoji = "⭐";
        const minimumAmount = 1;
        if (reaction.emoji.toString() !== starboardEmoji) {
            return;
        }
        const starboardMessage = await Guild_1.removeStar(reaction.message.guild.id, reaction.message.id);
        if (starboardMessage.starCount < minimumAmount) {
            const guild = await Guild_1.findGuild(reaction.message.guild.id);
            if (guild) {
                if (guild.starboardChannel) {
                    const starboardChannel = reaction.message.guild.channels.get(guild.starboardChannel);
                    if (starboardChannel) {
                        const channel = starboardChannel;
                        const message = channel.messages.find((message) => message.content.endsWith(`(${reaction.message.id})`));
                        if (message !== null) {
                            message.delete();
                        }
                    }
                }
            }
        }
        else {
            const guild = await Guild_1.findGuild(reaction.message.guild.id);
            if (guild) {
                if (guild.starboardChannel) {
                    const starboardChannel = reaction.message.guild.channels.get(guild.starboardChannel);
                    if (starboardChannel) {
                        const channel = starboardChannel;
                        const message = channel.messages.find((message) => message.content.endsWith(`(${reaction.message.id})`));
                        if (message !== null) {
                            return message.edit(`⭐ ${starboardMessage.starCount} ${reaction.message.channel.toString()} (${reaction.message.id})`);
                        }
                    }
                }
            }
        }
    }
    catch (e) {
        bot.logger.error(JSON.stringify(e));
    }
});
