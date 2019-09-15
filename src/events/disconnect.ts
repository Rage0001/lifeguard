import { RichEmbed, TextChannel } from "discord.js";
import { config } from "../private/config";
import { Event } from "./Event";

export const event = new Event("disconnect", async (bot, event: CloseEvent) => {
  const lang = bot.langs["en-US"].events.disconnect;
  const embed = new RichEmbed();
  embed.setTitle(lang.disconnected);
  embed.addField(lang.closeCode, event.code, true);
  embed.addField(lang.reason, event.reason, true);
  embed.setColor("RED");

  const wsLog = await bot.channels.get(config.wsLogChannel);
  if (wsLog) {
    (wsLog as TextChannel).send(embed);
  }
});
