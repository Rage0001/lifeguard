import { RichEmbed } from "discord.js";
import { Command } from "../Command";

export const command = new Command(
  "ping",
  async (msg, args, bot) => {
    try {
      const lang = bot.langs["en-US"].commands.ping;
      const message = await msg.channel.send("Ping?");
      if (!Array.isArray(message)) {
        const embed = new RichEmbed({
          description: bot.format(lang.body, {
            latency: `${Math.round(bot.ping)}`,
            ping: `${message.createdTimestamp - msg.createdTimestamp}`
          }),
          title: lang.title
        });
        message.edit("", embed);
      }
    } catch (err) {
      bot.logger.error(JSON.stringify(err));
    }
  },
  {
    guildOnly: true,
    hidden: false,
    level: 0,
    usage: ["ping"]
  }
);
