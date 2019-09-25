import { GuildChannel, RichEmbed, TextChannel } from "discord.js";
import { findGuild } from "../models/Guild";
import { Event } from "./Event";

export const event = new Event(
  "channelCreate",
  async (bot, channel: GuildChannel) => {
    const lang = bot.langs["en-US"].events.channelCreate;
    try {
      const guild = await findGuild(channel.guild.id);
      const embed = new RichEmbed({
        description: bot.format(lang.log, {
          id: channel.id,
          name: `<#${channel.id}>`
        })
      });
      embed.setTimestamp();
      if (guild) {
        const modlog = channel.guild.channels.get(guild.modLog);
        if (modlog) {
          (modlog as TextChannel).send(embed);
        }
      }
    } catch (err) {
      return {
        location: "ChannelCreate Event",
        message: err
      };
    }
  }
);
