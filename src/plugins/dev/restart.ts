import { RichEmbed } from "discord.js";
import { Command } from "../Command";

export const command = new Command(
  "restart",
  async (msg, args, bot) => {
    const lang = bot.langs["en-US"].commands.restart;
    const embed = new RichEmbed({
      description: lang.restart,
      title: lang.title
    });
    embed.setTimestamp();
    msg.channel.send(embed).then(() => {
      bot.restart(msg.channel.id);
    });
  },
  {
    guildOnly: true,
    hidden: true,
    level: 5,
    usage: ["restart"]
  }
);