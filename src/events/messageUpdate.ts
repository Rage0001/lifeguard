import { Message, RichEmbed, TextChannel } from "discord.js";
import { findGuild } from "../models/Guild";
import { Event } from "./Event";

export const event = new Event(
  "messageUpdate",
  async (bot, old: Message, newMsg: Message) => {
    const lang = bot.langs["en-US"].events.messageUpdate;
    try {
      const dbGuild = await findGuild(old.guild.id);
      const embed = new RichEmbed({
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
            (modlog as TextChannel).send(embed);
          }
        }
      }
    } catch (err) {
      return {
        location: "messageUpdate Event",
        message: err
      };
    }
  }
);
