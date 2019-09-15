import { Message, MessageReaction, RichEmbed, User } from "discord.js";
import { Command } from "../Command";

export const command = new Command(
  "announce",
  async (msg, args, bot) => {
    try {
      const lang = bot.langs["en-US"].commands.announce;
      const channel = msg.mentions.channels.first();
      if (channel.guild.id !== msg.guild.id) {
        return msg.channel.send(lang.errors.notValidChannel);
      }
      if (!channel) {
        return msg.channel.send(lang.errors.notValidChannel);
      }

      const channelPermissions = msg.guild.me.permissionsIn(channel);
      if (!channelPermissions.has("VIEW_CHANNEL") || !channelPermissions.has("SEND_MESSAGES")) {
        msg.channel.send(lang.errors.noPermissions);
      }

      const announceMessage = args.slice(1).join(" ");

      const embed = new RichEmbed();
      embed.setDescription(announceMessage);

      const confirmationMsg = await msg.channel.send(lang.confirmation, embed);
      const yesReaction = await (confirmationMsg as Message).react("✅");
      const noReaction = await (confirmationMsg as Message).react("❌");

      const filter = (reaction: MessageReaction, user: User) => user.id === msg.author.id;
      const messageCollector = (confirmationMsg as Message).createReactionCollector(filter, { time: 15000 });

      messageCollector.on("collect", r => {
        switch (r.emoji.name) {
          case "✅":
            const yesUserReaction = r.message.reactions.filter(r => r.emoji.name === "✅");
            yesUserReaction.first().remove(msg.author);
            channel.send(announceMessage);
            (confirmationMsg as Message).edit(lang.announced, { embed: {} });
            messageCollector.stop();
            break;
          case "❌":
            const noUserReaction = r.message.reactions.filter(r => r.emoji.name === "❌");
            noUserReaction.first().remove(msg.author);
            (confirmationMsg as Message).edit(lang.abort, { embed: {} });
            messageCollector.stop();
            break;
          default:
            break;
        }
      });
      messageCollector.on("end", c => {
        yesReaction.remove(bot.user);
        noReaction.remove(bot.user);
      });
    } catch (err) {
      bot.logger.error(JSON.stringify(err));
    }
  },
  {
    guildOnly: true,
    hidden: false,
    level: 3,
    usage: ["announce {channel} {message}"]
  }
);
