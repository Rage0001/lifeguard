import { Command } from "../Command";

export const command = new Command(
  "nick",
  async (msg, args, bot) => {
    try {
      const lang = bot.langs["en-US"].commands.nick;
      const member = msg.mentions.members.first() || msg.guild.members.get(args[1]);
      if (!member) {
        return msg.channel.send(lang.errors.invalidMember);
      }
      switch (args[0].toLowerCase()) {
        case "set":
          const nick = args.slice(2).join(" ");
          member.setNickname(nick);
          msg.channel.send(bot.format(lang.addedNickname, {
            member: member.user.tag,
            nickname: nick
          }));
          break;
        case "rmv":
          member.setNickname("");
          msg.channel.send(bot.format(lang.removedNickname, {
            member: member.user.tag
          }));
          break;
        default:
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
    usage: ["nick set {user} {nickname}", "nick rmv {user}"]
  }
);
