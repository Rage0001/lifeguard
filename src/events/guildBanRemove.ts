import { Guild, RichEmbed, TextChannel, User } from "discord.js";
import { findGuild } from "../models/Guild";
import { Event } from "./Event";

export const event = new Event(
  "guildBanRemove",
  async (bot, guild: Guild, user: User) => {
    const lang = bot.langs["en-US"].events.guildBanRemove;
    try {
      const dbGuild = await findGuild(guild.id);
      const embed = new RichEmbed({
        description: bot.format(lang.log, {
          id: user.id,
          name: `<@${user.id}>`
        }),
        title: lang.title
      });
      embed.setTimestamp();
      if (dbGuild) {
        const modlog = guild.channels.get(dbGuild.modLog);
        if (modlog) {
          (modlog as TextChannel).send(embed);
        }
      }
    } catch (err) {
      return {
        location: "GuildBanRemove Event",
        message: err
      };
    }
  }
);
