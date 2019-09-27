import { Message, RichEmbed, TextChannel } from "discord.js";
import { findGuild } from "../models/Guild";
import { Command } from "../plugins/Command";
import { Event } from "./Event";

export const event = new Event(
  "lifeguardCommandUsed",
  async (bot, msg: Message, command: Command) => {
    const lang = bot.langs["en-US"].events.lifeguardCommandUsed;
    try {
      const dbGuild = await findGuild(msg.guild.id);
      const embed = new RichEmbed({
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
          (modlog as TextChannel).send(embed);
        }
      }
    } catch (err) {
      return {
        location: "lifeguardCommandUsed Event",
        message: err
      };
    }
  }
);
