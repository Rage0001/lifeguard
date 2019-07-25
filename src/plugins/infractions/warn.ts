import { RichEmbed } from "discord.js";
import { findUser } from "../../models/User";
import { Command } from "../Command";

export const command = new Command(
  "warn",
  async (msg, args, bot) => {
    const lang = bot.langs["en-US"].commands.warn;
    const user = await findUser(args[0]);
    if (user) {
      const infs = user.get("infractions");
      infs.push({
        action: "Warning",
        active: true,
        guild: msg.guild.id,
        id: infs.length + 1,
        moderator: msg.author.id,
        reason: args.slice(1).join(" "),
        time: Date.now()
      });
      user.set("infractions", infs);
      user.markModified("infractions");
      user.save();
      const embed = new RichEmbed({
        description: bot.format(lang.inf.desc, {
          guild: msg.guild.name,
          reason: args.slice(1).join(" ")
        }),
        title: lang.inf.title
      });
      const u = bot.users.get(user.id);
      if (u) {
        u.send(embed);
      }
      // TODO: send to mod log
    } else {
      const embed = new RichEmbed({
        description: lang.errors.noUser
      });
      msg.channel.send(embed);
    }
  },
  {
    guildOnly: true,
    hidden: false,
    level: 2,
    usage: ["warn [user] [reason]"]
  }
);
