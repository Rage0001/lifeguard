import { Guild, RichEmbed } from "discord.js";
import { Event } from "./Event";

export const event = new Event("guildCreate", async (bot, g: Guild) => {
  try {
    const embed = new RichEmbed({
      description:
        "Thank You for adding Lifegaurd to your server! To begin using Lifeguard, run !setup"
    });
    g.defaultChannel.send(embed);
  } catch (err) {
    return {
      location: "GuildCreate Event",
      message: err
    };
  }
});
