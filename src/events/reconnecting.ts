import { RichEmbed, TextChannel } from "discord.js";
import { config } from "../private/config";
import { Event } from "./Event";

export const event = new Event("reconnecting", async (bot) => {
  const lang = bot.langs["en-US"].events.reconnecting;
  const embed = new RichEmbed();
  embed.setTitle(lang);
  embed.setColor("YELLOW");

  const wsLog = await bot.channels.get(config.wsLogChannel);
  if (wsLog) {
    (wsLog as TextChannel).send(embed);
  }
});
