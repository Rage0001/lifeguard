import { RichEmbed, TextChannel } from "discord.js";
import { parseUser } from "../../helpers/parseUser";
import { findGuild } from "../../models/Guild";
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
        await msg.guild.ban(userID, { reason });
        const responseEmbed = new RichEmbed({
          description: bot.format(lang.inf.responseDesc, {
            reason,
            user: `${u.username}#${u.discriminator} (${u.id})`
          })
        });
        msg.channel.send(responseEmbed);

        const guild = await findGuild(msg.guild.id);
        if (guild) {
          if (guild.modLog) {
            const modLog = msg.guild.channels.get(guild.modLog);
            if (modLog) {
              const embed2 = new RichEmbed({
                description: bot.format(lang.inf.modLog, {
                  mod: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
                  reason,
                  user: `${u.username}#${u.discriminator} (${u.id})`
                })
              });
              (modLog as TextChannel).send(embed2);
            }
          }
        }
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
