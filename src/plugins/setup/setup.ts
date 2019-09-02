import { Message, MessageCollector, RichEmbed } from "discord.js";
import { findGuild } from "../../models/Guild";
import { Command } from "../Command";

export const command = new Command(
  "setup",
  async (msg, args, bot) => {
    const lang = bot.langs["en-US"].commands.setup;
    const m = await msg.channel.send(
      new RichEmbed({
        description: bot.format(lang.collector.start, {
          user: msg.author.tag
        })
      })
    );
    if (!Array.isArray(m)) {
      m.delete(10000);
    }
    const collector = new MessageCollector(msg.channel, (m: Message) => {
      return m.author.id === msg.author.id;
    });

    interface IGuildData {
      [k: string]: any;
      id: string;
      locale: string;
      modLog?: string;
      modRole?: string;
      prefix?: string;
    }
    const guildData: IGuildData = { id: msg.guild.id, locale: "en-US", prefix: bot.prefix };
    const msgs: Message[] = [];

    const help = await msg.channel.send(
      new RichEmbed({
        description: lang.collector.help
      })
    );
    if (!Array.isArray(help)) {
      msgs.push(help);
    }

    collector.once("end", async (coll) => {
      Array.from(coll.values()).map(msg => msg.delete(1000));
      msgs.map(msg => msg.delete(2000));
      console.log(guildData);
      const guild = await findGuild(msg.guild.id);
      if (guild) {
        Object.keys(guildData).map((k) => {
          guild.set(k, guildData[k]);
          guild.markModified(k);
        });
        await guild.save();
      }
      const m = await msg.channel.send(
        new RichEmbed({
          description: lang.collector.end
        })
      );
      if (!Array.isArray(m)) {
        m.delete(3000);
      }
    });

    collector.on("collect", async (m, coll) => {
      const split = m.content.split(" ");
      const name = split[0];
      split.shift();
      const args = split;

      let botMsg;

      switch (name) {
        case "help":
          botMsg = await msg.channel.send(
            new RichEmbed({
              description: lang.collector.help
            })
          );
          if (!Array.isArray(botMsg)) {
            msgs.push(botMsg);
          }

          break;

        case "locale":
          guildData.locale = args[0];
          botMsg = await msg.channel.send(
            new RichEmbed({
              description: bot.format(lang.collector.localeCollected, {
                locale: guildData.locale
              })
            })
          );
          if (!Array.isArray(botMsg)) {
            msgs.push(botMsg);
          }

          break;

        case "modLog":
          guildData.modLog = args[0];
          botMsg = await msg.channel.send(
            new RichEmbed({
              description: bot.format(lang.collector.modLogCollected, {
                modLog: guildData.modLog
              })
            })
          );
          if (!Array.isArray(botMsg)) {
            msgs.push(botMsg);
          }

          break;

        case "modRole":
          guildData.modRole = args[0];
          botMsg = await msg.channel.send(
            new RichEmbed({
              description: bot.format(lang.collector.modRoleCollected, {
                modRole: guildData.modRole
              })
            })
          );
          if (!Array.isArray(botMsg)) {
            msgs.push(botMsg);
          }

          break;

        case "prefix":
          guildData.prefix = args[0];
          botMsg = await msg.channel.send(
            new RichEmbed({
              description: bot.format(lang.collector.prefixCollected, {
                prefix: guildData.prefix
              })
            })
          );
          if (!Array.isArray(botMsg)) {
            msgs.push(botMsg);
          }

          break;

        case "end":
          coll.stop();

          break;

        default:
          botMsg = await msg.channel.send(
            new RichEmbed({
              description: lang.collector.help
            })
          );
          if (!Array.isArray(botMsg)) {
            msgs.push(botMsg);
          }

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
