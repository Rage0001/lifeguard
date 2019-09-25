import { GuildMember, RichEmbed, TextChannel } from "discord.js";
import moment from "moment";
import { findGuild } from "../models/Guild";
import { Event } from "./Event";

export const event = new Event(
  "guildMemberAdd",
  async (bot, member: GuildMember) => {
    const lang = bot.langs["en-US"].events.guildMemberAdd;
    try {
      const dbGuild = await findGuild(member.guild.id);
      const embed = new RichEmbed({
        description: bot.format(lang.log, {
          id: member.id,
          name: `<@${member.id}>`,
          createdAt: `${moment(member.user.createdTimestamp).fromNow()}`
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
        location: "guildMemberAdd Event",
        message: err
      };
    }
  }
);
