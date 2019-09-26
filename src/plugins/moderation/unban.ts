import { RichEmbed, TextChannel } from "discord.js";
import { parseUser } from "../../helpers/parseUser";
import { Command } from "../Command";

export const command = new Command(
  "unban",
  async (msg, args, bot) => {
    try {
      const lang = bot.langs["en-US"].commands.unban;
      const userID = parseUser(args[0]);
      const reason = args.slice(1).join(" ");

      bot.addEvent({
        args: [userID, msg.author.id, reason, msg.guild.id],
        event: "guildBanRemove"
      });

      const u = await msg.guild.unban(userID);

      const responseEmbed = new RichEmbed({
        description: bot.format(lang.inf.responseDesc, {
          reason,
          user: `${u.username}#${u.discriminator} (${u.id})`
        })
      });
      msg.channel.send(responseEmbed);
    } catch (err) {
      bot.logger.error(JSON.stringify(err));
    }
  },
  {
    guildOnly: true,
    hidden: false,
    level: 2,
    usage: ["unban {user} [reason]"]
  }
);
