import {
  Collection,
  Message,
  RichEmbed,
  Snowflake,
  TextChannel
} from "discord.js";
import { findGuild } from "../models/Guild";
import { Event } from "./Event";

export const event = new Event(
  "messageDeleteBulk",
  async (bot, msgs: Collection<Snowflake, Message>) => {
    const lang = bot.langs["en-US"].events.messageDeleteBulk;
    try {
      const msg = msgs.array()[0];
      const pendingEvent = bot.pendingEvents
        .filter(e => e.event === "messageDeleteBulk")
        .find(e => e.args[1] === msg.guild.id);
      const dbGuild = await findGuild(msg.guild.id);
      const embed = new RichEmbed({
        description: bot.format(lang.default, {
          channel: `<#${msg.channel.id}>`,
          count: `${msgs.size}`
        })
      });
      embed.setTimestamp();
      if (pendingEvent) {
        embed.setDescription(
          bot.format(lang.log, {
            channel: `<#${msg.channel.id}>`,
            count: `${msgs.size}`,
            mod: `<@${pendingEvent.args[0]}>`,
            modID: pendingEvent.args[0]
          })
        );
        bot.removeEvent(pendingEvent);
      }
      if (dbGuild) {
        const modlog = msg.guild.channels.get(dbGuild.modLog);
        if (modlog) {
          (modlog as TextChannel).send(embed);
        }
      }
    } catch (err) {
      return {
        location: "messageDeleteBulk Event",
        message: err
      };
    }
  }
);
