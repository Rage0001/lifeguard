import { MessageReaction, RichEmbed, TextChannel, User } from "discord.js";
import { addStar, findGuild } from "../models/Guild";
import { Event } from "./Event";

export const event = new Event("messageReactionAdd", async (bot, reaction: MessageReaction, user: User) => {
  try {
    const lang = bot.langs["en-US"].starboard;
    const starboardEmoji = "⭐";
    const minimumAmount = 1;
    if (reaction.emoji.name !== starboardEmoji) {
      return;
    }
    // if (reaction.message.author.id === user.id) {
    //   return reaction.remove();
    // }
    const starboardMessage = await addStar(reaction.message.guild.id, reaction.message.id);
    if (starboardMessage.starCount < minimumAmount) {
      return;
    } else {
      const guild = await findGuild(reaction.message.guild.id);
      if (guild) {
        if (guild.starboardChannel) {
          const starboardChannel = reaction.message.guild.channels.get(guild.starboardChannel);
          const embed = new RichEmbed();
          embed.setTimestamp();
          embed.setColor("#ffd817");
          embed.setAuthor(reaction.message.author.tag, reaction.message.author.avatarURL);
          embed.setDescription(`${reaction.message.content}\n\n>> [${lang.jump}](https://discordapp.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id})`);
          if (reaction.message.attachments.size > 0) {
            embed.setImage(reaction.message.attachments.first().proxyURL);
          }
          if (starboardChannel) {
            const channel = (starboardChannel as TextChannel);
            const message = channel.messages.find((message) => message.content.endsWith(`(${reaction.message.id})`));
            if (message !== null) {
              return message.edit(`⭐ ${starboardMessage.starCount} ${reaction.message.channel.toString()} (${reaction.message.id})`);
            } else {
              return channel.send(`⭐ ${starboardMessage.starCount} ${reaction.message.channel.toString()} (${reaction.message.id})`, embed);
            }
          }
        }
      }
    }
  } catch (e) {
    bot.logger.error(JSON.stringify(e));
  }

});
