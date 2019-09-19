import { Message } from "discord.js";
import { calcLevel } from "../helpers/calcLevel";
import { findGuild } from "../models/Guild";
import { createUser, findUser } from "../models/User";
import { Event } from "./Event";

export const event = new Event("message", async (bot, msg: Message) => {
  try {
    const user = await findUser(msg.author.id);
    const guildConfig = await findGuild(msg.guild.id);
    if (user) {
      if (msg.content.startsWith(bot.prefix)) {
        const split = msg.content.split(" ");
        const name = split[0].slice(bot.prefix.length);
        split.shift();
        const args = split;
        const plugin = bot.plugins.find(plugin => plugin.commands.has(name));
        if (plugin) {
          const cmd = plugin.commands.get(name);
          if (cmd) {
            if (cmd.options.guildOnly) {
              const level = await calcLevel(msg.member, msg.guild);
              if (cmd.options.level <= level) {
                cmd.func(msg, args, bot, guildConfig);
              }
            } else {
              cmd.func(msg, args, bot);
            }
          }
        }
      } else {
        return;
      }
    } else {
      createUser({
        id: msg.author.id,
        infractions: [],
        reminders: []
      });
    }
  } catch (err) {
    return {
      location: "Message Event",
      message: err
    };
  }
});
