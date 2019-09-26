import { MessageReaction, TextChannel, User } from "discord.js";
import { findGuild, removeStar } from "../models/Guild";
import { Event } from "./Event";

export const event = new Event(
  "messageReactionRemove",
  async (bot, reaction: MessageReaction, user: User) => {
    try {
      const lang = bot.langs["en-US"].starboard;
      const starboardEmoji = "⭐";
      const minimumAmount = 1;
      if (reaction.emoji.toString() !== starboardEmoji) {
        return;
      }
      const starboardMessage = await removeStar(
        reaction.message.guild.id,
        reaction.message.id
      );
      if (starboardMessage.starCount < minimumAmount) {
        const guild = await findGuild(reaction.message.guild.id);
        if (guild) {
          if (guild.starboardChannel) {
            const starboardChannel = reaction.message.guild.channels.get(
              guild.starboardChannel
            );
            if (starboardChannel) {
              const channel = starboardChannel as TextChannel;
              const message = channel.messages.find(message =>
                message.content.endsWith(`(${reaction.message.id})`)
              );
              if (message !== null) {
                message.delete();
              }
            }
          }
        }
      } else {
        const guild = await findGuild(reaction.message.guild.id);
        if (guild) {
          if (guild.starboardChannel) {
            const starboardChannel = reaction.message.guild.channels.get(
              guild.starboardChannel
            );
            if (starboardChannel) {
              const channel = starboardChannel as TextChannel;
              const message = channel.messages.find(message =>
                message.content.endsWith(`(${reaction.message.id})`)
              );
              if (message !== null) {
                return message.edit(
                  `⭐ ${
                    starboardMessage.starCount
                  } ${reaction.message.channel.toString()} (${
                    reaction.message.id
                  })`
                );
              }
            }
          }
        }
      }
    } catch (e) {
      bot.logger.error(JSON.stringify(e));
    }
  }
);
