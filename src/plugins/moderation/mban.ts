import { RichEmbed } from "discord.js";
import { Command } from "../Command";
import { command as Ban } from "./ban";

export const command = new Command(
  "mkban",
  async (msg, args, bot) => {
    try {
      const lang = bot.langs["en-US"].commands.mban;
      if (args.indexOf("-r") === -1) {
        for (const arg of args) {
          Ban.func(msg, [arg, lang.reason], bot);
        }
      } else {
        const argStr = args.join(" ");
        const split = argStr.split("-r");
        const users = split[0].split(" ").filter(u => u !== "");
        const reason = split[1];
        for (const user of users) {
          Ban.func(msg, [user, reason], bot);
        }
      }
    } catch (err) {
      bot.logger.error(JSON.stringify(err));
    }
  },
  {
    guildOnly: true,
    hidden: false,
    level: 0,
    usage: ["mkick {users}", "mkick {users} -r {reason}"]
  }
);
