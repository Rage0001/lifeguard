import { RichEmbed, TextChannel } from "discord.js";
import { config } from "../private/config";
import { Event } from "./Event";

export const event = new Event("resume", async bot => {
  const lang = bot.langs["en-US"].events.resume;
  const embed = new RichEmbed();
  embed.setTitle(lang.resume);
  embed.setColor("GREEN");

  const wsLog = await bot.channels.get(config.wsLogChannel);
  if (wsLog) {
    (wsLog as TextChannel).send(embed);
  }
});
