import { Guild, RichEmbed, TextChannel, User } from "discord.js";
import { findGuild } from "../models/Guild";
import { Event } from "./Event";

export const event = new Event(
  "guildBanAdd",
  async (bot, guild: Guild, user: User) => {
    const lang = bot.langs["en-US"].events.guildBanAdd;
    try {
      const pendingEvent = bot.pendingEvents
        .filter(e => e.event === "guildBanAdd")
        .filter(e => e.args[3] === guild.id)
        .find(e => e.args[0] === user.id);
      const ban = await guild.fetchBan(user);
      const dbGuild = await findGuild(guild.id);
      const embed = new RichEmbed();
      embed.setTimestamp();
      if (pendingEvent) {
        embed.setDescription(
          bot.format(lang.log, {
            id: pendingEvent.args[0],
            mod: `<@${pendingEvent.args[1]}>`,
            modID: pendingEvent.args[1],
            name: `<@${pendingEvent.args[0]}>`,
            reason: `${pendingEvent.args[2]}`
          })
        );
        bot.removeEvent(pendingEvent);
      } else {
        embed.setDescription(
          bot.format(lang.default, {
            id: user.id,
            name: `<@${user.id}>`,
            reason: `${ban.reason}`
          })
        );
      }
      if (dbGuild) {
        const modlog = guild.channels.get(dbGuild.modLog);
        if (modlog) {
          (modlog as TextChannel).send(embed);
        }
      }
    } catch (err) {
      return {
        location: "GuildBanAdd Event",
        message: err
      };
    }
  }
);
