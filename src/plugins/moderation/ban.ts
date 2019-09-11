import { RichEmbed, TextChannel } from "discord.js";
import { parseUser } from "../../helpers/parseUser";
import { findGuild } from "../../models/Guild";
import { findUser } from "../../models/User";
import { Command } from "../Command";

export const command = new Command(
  "ban",
  async (msg, args, bot) => {
    const lang = bot.langs["en-US"].commands.ban;
    const userID = parseUser(args[0]);
    const user = await findUser(userID);
    if (user) {
      const banMember = msg.guild.members.get(userID);
      if (banMember) {
        if (banMember.bannable) {
          const u = bot.users.get(user.id);
          const reason = args.slice(1).join(" ");
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
            banMember.ban(reason);

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
        } else {
          const errorEmbed = new RichEmbed({
            description: lang.errors.notBannable
          });
          return msg.channel.send(errorEmbed);
        }
      }
    } else {
      const embed = new RichEmbed({
        description: lang.errors.noUser,
      });
      msg.channel.send(embed);
    }
  },
  {
    guildOnly: true,
    hidden: false,
    level: 2,
    usage: ["ban {user} [reason]"]
  }
);
