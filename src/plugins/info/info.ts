import { GuildMember, RichEmbed, User } from "discord.js";
import { parseUser } from "../../helpers/parseUser";
import { findUser, IUserDoc } from "../../models/User";
import { Command } from "../Command";

class UnknownUser extends User {}

export const command = new Command(
  "info",
  async (msg, args, bot) => {
    try {
      const lang = bot.langs["en-US"].commands.info;
      const embed = new RichEmbed();
      let dbUser: IUserDoc | undefined;
      let user;

      function addInfo(user: GuildMember | UnknownUser | User) {
        if (user instanceof GuildMember) {
          embed.addField("User Mention", user.user.toString());
          embed.addField("Status", lang.status[user.presence.status]);
          embed.addField(
            "Game",
            user.presence.game ? user.presence.game.name : lang.notPlaying
          );
          embed.addField(
            "Roles",
            user.roles
              .filter(r => r.id !== msg.guild.id)
              .map(r => r.name)
              .join("\n")
          );
          embed.addField("Joined Server", user.joinedAt);
          embed.addField("Joined Discord", user.user.createdAt);
          if (dbUser) {
            embed.addField("Infraction Count", dbUser.infractions.length);
          }
          embed.setThumbnail(user.user.displayAvatarURL);
        } else if (user instanceof UnknownUser) {
          embed.addField("User Mention", user.toString());
          embed.addField("Joined Discord", user.createdAt);
          embed.setThumbnail(user.displayAvatarURL);
        } else {
          embed.addField("User Mention", user.toString());
          embed.addField("Status", lang.status[user.presence.status]);
          embed.addField(
            "Game",
            user.presence.game ? user.presence.game.name : lang.notPlaying
          );
          embed.addField("Joined Discord", user.createdAt);
          if (dbUser) {
            embed.addField("Infraction Count", dbUser.infractions.length);
          }
          embed.setThumbnail(user.displayAvatarURL);
        }
      }

      if (args.length <= 0) {
        user = msg.member;
        dbUser = await findUser(user.id);
        addInfo(user);
      } else if (msg.guild.members.has(parseUser(args[0]))) {
        user = msg.guild.members.find(u => u.id === parseUser(args[0]));
        dbUser = await findUser(user.id);
        addInfo(user);
      } else if (bot.users.has(parseUser(args[0]))) {
        user = bot.users.find(u => u.id === parseUser(args[0]));
        dbUser = await findUser(user.id);
        addInfo(user);
      } else {
        user = (await bot.fetchUser(parseUser(args[0]))) as UnknownUser;
        addInfo(user);
      }
      embed.setTimestamp();
      msg.channel.send(embed);
    } catch (err) {
      bot.logger.error(err);
    }
  },
  {
    guildOnly: true,
    hidden: false,
    level: 0,
    usage: ["ping"]
  }
);
