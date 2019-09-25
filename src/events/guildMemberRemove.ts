import { GuildMember, RichEmbed, TextChannel } from "discord.js";
import { findGuild } from "../models/Guild";
import { Event } from "./Event";

export const event = new Event(
  "guildMemberRemove",
  async (bot, member: GuildMember) => {
    const lang = bot.langs["en-US"].events.guildMemberRemove;
    try {
      const dbGuild = await findGuild(member.guild.id);
      const embed = new RichEmbed({
        description: bot.format(lang.log, {
          id: member.id,
          name: `<@${member.id}>`
        })
      });
      embed.setTimestamp();
      if (dbGuild) {
        const modlog = member.guild.channels.get(dbGuild.modLog);
        if (modlog) {
          (modlog as TextChannel).send(embed);
        }
      }
    } catch (err) {
      return {
        location: "guildMemberRemove Event",
        message: err
      };
    }
  }
);
