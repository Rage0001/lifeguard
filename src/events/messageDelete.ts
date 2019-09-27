import { Message, RichEmbed, TextChannel } from "discord.js";
import { findGuild } from "../models/Guild";
import { Event } from "./Event";

export const event = new Event("messageDelete", async (bot, msg: Message) => {
  const lang = bot.langs["en-US"].events.messageDelete;
  try {
    const dbGuild = await findGuild(msg.guild.id);
    const embed = new RichEmbed({
      description: bot.format(lang.log, {
        channel: `<#${msg.channel.id}>`,
        id: msg.member.id,
        name: `<@${msg.member.id}>`
      })
    });
    embed.setTimestamp();
    if (!msg.author.bot) {
      if (dbGuild) {
        const modlog = msg.guild.channels.get(dbGuild.modLog);
        if (modlog) {
          (modlog as TextChannel).send(embed);
        }
      }
    }
  } catch (err) {
    return {
      location: "messageDelete Event",
      message: err
    };
  }
});
