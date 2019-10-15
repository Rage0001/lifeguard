import { RichEmbed } from "discord.js";
import { Command } from "../Command";
import { command as Kick } from "./kick";

export const command = new Command(
  "mkick",
  async (msg, args, bot) => {
    try {
      const lang = bot.langs["en-US"].commands.mkick;
      if (args.indexOf("-r") === -1) {
        for (const arg of args) {
          Kick.func(msg, [arg, lang.reason], bot);
        }
      } else {
        const argStr = args.join(" ");
        const split = argStr.split("-r");
        const users = split[0].split(" ").filter(u => u !== "");
        const reason = split[1];
        for (const user of users) {
          Kick.func(msg, [user, reason], bot);
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
