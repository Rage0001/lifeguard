import { RichEmbed, TextChannel } from "discord.js";
import { parseUser } from "../../helpers/parseUser";
import { Command } from "../Command";

export const command = new Command(
  "forceban",
  async (msg, args, bot) => {
    try {
      const lang = bot.langs["en-US"].commands.forceban;
      const userID = parseUser(args[0]);
      const u = await bot.fetchUser(userID);
      if (u) {
        const reason = args.slice(1).join(" ");
        bot.addEvent({
          args: [u.id, msg.author.id, reason, msg.guild.id],
          event: "guildBanAdd"
        });
        await msg.guild.ban(userID, { reason });
        const responseEmbed = new RichEmbed({
          description: bot.format(lang.inf.responseDesc, {
            reason,
            user: `${u.username}#${u.discriminator} (${u.id})`
          })
        });
        msg.channel.send(responseEmbed);
      }
    } catch (err) {
      bot.logger.error(JSON.stringify(err));
    }
  },
  {
    guildOnly: true,
    hidden: false,
    level: 2,
    usage: ["ban {user} [reason]"]
  }
);
