import { Message, MessageCollector, RichEmbed } from "discord.js";
import { createGuild } from "../../models/Guild";
import { Command } from "../Command";

export const command = new Command(
  "setup",
  async (msg, args, bot) => {
    const lang = bot.langs["en-US"].commands.setup;
    await msg.channel.send(
      new RichEmbed({
        description: bot.format(lang.collector.start, {
          user: msg.author.tag
        })
      })
    );
    const collector = new MessageCollector(msg.channel, (m: Message) => {
      return m.author.id === msg.author.id;
    });

    interface IGuildData {
      id: string;
      locale?: string;
      modRole?: string;
      prefix?: string;
    }
    const guildData: IGuildData = { id: msg.guild.id };

    collector.once("end", (coll, reason) => {
      console.log(Array.from(coll.values()).map(msg => msg.content));
      console.log(guildData);
      msg.channel.send(
        new RichEmbed({
          description: lang.collector.end
        })
      );
    });

    collector.on("collect", (m, coll) => {
      const split = m.content.split(" ");
      const name = split[0];
      split.shift();
      const args = split;

      switch (name) {
        case "help":
          msg.channel.send(
            new RichEmbed({
              description: lang.collector.help
            })
          );

          break;

        case "locale":
          guildData.locale = args[0];
          msg.channel.send(
            new RichEmbed({
              description: bot.format(lang.collector.localeCollected, {
                locale: guildData.locale
              })
            })
          );

          break;

        case "modRole":
          guildData.modRole = args[0];
          msg.channel.send(
            new RichEmbed({
              description: bot.format(lang.collector.modRoleCollected, {
                modRole: guildData.modRole
              })
            })
          );

          break;

        case "prefix":
          guildData.prefix = args[0];
          msg.channel.send(
            new RichEmbed({
              description: bot.format(lang.collector.prefixCollected, {
                prefix: guildData.prefix
              })
            })
          );

          break;

        case "end":
          coll.stop();

          break;

        default:
          msg.channel.send(
            new RichEmbed({
              description: lang.collector.help
            })
          );
          break;
      }
    });
  },
  {
    guildOnly: true,
    hidden: false,
    level: 0,
    usage: ["setup"]
  }
);
