import { RichEmbed } from "discord.js";
import { findUser } from "../../models/User";
import { Command } from "../Command";

export const command = new Command(
  "inf",
  async (msg, args, bot) => {
    try {
      const lang = bot.langs["en-US"].commands.inf;
      switch (args[0]) {
        case "search":
          const user = await findUser(args[1]);
          if (user) {
            const infs = user.get("infractions");
            bot.logger.debug(infs);
          } else {
            const embed = new RichEmbed({
              description: lang.errors.noUser
            });
            msg.channel.send(embed);
          }
          break;
      }
    } catch (err) {
      bot.logger.error(JSON.stringify(err));
    }
  },
  {
    guildOnly: true,
    hidden: false,
    level: 2,
    usage: ["inf"]
  }
);
