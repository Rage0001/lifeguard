import { Guild, RichEmbed, TextChannel } from "discord.js";
import { createGuild } from "../models/Guild";
import { Event } from "./Event";

export const event = new Event("guildCreate", async (bot, guild: Guild) => {
  const lang = bot.langs["en-US"].events.guildCreate;
  try {
    await createGuild({
      id: guild.id,
      starboard: []
    });
    const embed = new RichEmbed({
      description:
        bot.format(lang, {
          id: guild.id,
        })
    });
    (guild.systemChannel as TextChannel).send(embed);
  } catch (err) {
    return {
      location: "GuildCreate Event",
      message: err
    };
  }
});
