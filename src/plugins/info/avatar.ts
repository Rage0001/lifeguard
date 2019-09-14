import { RichEmbed } from "discord.js";
import { parseUser } from "../../helpers/parseUser";
import { Command } from "../Command";

export const command = new Command(
  "avatar",
  async (msg, args, bot) => {
    const avatar = args[0] ? (await bot.fetchUser(parseUser(args[0]))).avatarURL : msg.author.avatarURL;
    const embed = new RichEmbed();
    embed.setImage(avatar);
    msg.channel.send(embed);
  },
  {
    guildOnly: false,
    hidden: false,
    level: 0,
    usage: ["avatar", "avatar <user>"]
  }
);
