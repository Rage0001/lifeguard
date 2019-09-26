import { RichEmbed, TextChannel } from "discord.js";
import { parseUser } from "../../helpers/parseUser";
import { findUser } from "../../models/User";
import { Command } from "../Command";

export const command = new Command(
  "ban",
  async (msg, args, bot) => {
    try {
      const lang = bot.langs["en-US"].commands.ban;
      const userID = parseUser(args[0]);
      const user = await findUser(userID);

      const banMember = msg.guild.members.get(userID);
      if (banMember) {
        if (banMember.bannable) {
          const u = bot.users.get(userID);
          const reason = args.slice(1).join(" ");

          if (user) {
            const infs = user.get("infractions");

            infs.push({
              action: "Ban",
              active: true,
              guild: msg.guild.id,
              id: infs.length + 1,
              moderator: msg.author.id,
              reason,
              time: Date.now()
            });
            user.set("infractions", infs);
            user.markModified("infractions");
            user.save();
          } else {
            const embed = new RichEmbed({
              description: lang.errors.noUser
            });
            msg.channel.send(embed);
          }

          const embed = new RichEmbed({
            description: bot.format(lang.inf.desc, {
              guild: msg.guild.name,
              reason
            }),
            title: lang.inf.title
          });
          embed.setTimestamp();

          if (u) {
            await u.send(embed);
            bot.addEvent({
              args: [u.id, msg.author.id, reason, msg.guild.id],
              event: "guildBanAdd"
            });
            banMember.ban({ reason });

            const responseEmbed = new RichEmbed({
              description: bot.format(lang.inf.responseDesc, {
                reason,
                user: `${u.username}#${u.discriminator} (${u.id})`
              })
            });
            msg.channel.send(responseEmbed);
          }
        } else {
          const errorEmbed = new RichEmbed({
            description: lang.errors.notBannable
          });
          return msg.channel.send(errorEmbed);
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
