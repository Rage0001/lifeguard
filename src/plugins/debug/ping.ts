import { Command } from "@plugins/Command";
import { defaultEmbed } from "@util/DefaultEmbed";
import { MessageEmbed } from "discord.js";

export const command: Command = new Command(
  "ping",
  async (lifeguard, msg, args) => {
    const m = await msg.channel.send("Ping?");
    m.delete({ timeout: 100 });

    const embed: MessageEmbed = defaultEmbed()
      .setTitle("Pong! :ping_pong:")
      .addFields([
        {
          name: "Bot Latency",
          value: `${Math.round(lifeguard.ws.ping)}ms`
        },
        {
          name: "Message Latency",
          value: `${m.createdTimestamp - msg.createdTimestamp}ms`
        }
      ])
      .setFooter(
        `Executed By ${msg.author.tag}`,
        msg.author.avatarURL() ?? msg.author.defaultAvatarURL
      );

    msg.channel.send(embed);
  },
  {
    level: 0,
    usage: ["ping"]
  }
);
