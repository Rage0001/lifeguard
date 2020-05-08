import {Guild, Message} from 'discord.js';

import {Event} from '@events/Event';
import {PluginClient} from '@lifeguard/PluginClient';
import {UserDoc} from '@lifeguard/database/User';
import {calcUserLevel} from '@assertions/userLevel';
import {prefix} from '@config/bot';

function parseContent(content: string) {
  const split = content.split(' ');
  const cmdName = split[0].slice(prefix.length);
  split.shift();
  return [cmdName, ...split];
}

async function getCommandFromPlugin(
  lifeguard: PluginClient,
  cmdName: string,
  guild: Guild
) {
  const guildDB = await lifeguard.db.guilds.findById(guild.id);
  const plugin = lifeguard.plugins.find(p => p.has(cmdName));
  if (plugin) {
    if (
      guildDB?.config.plugins.has(plugin.name) &&
      guildDB?.config.plugins.get(plugin.name)?.enabled
    ) {
      return plugin?.get(cmdName);
    } else {
      return undefined;
    }
  } else {
    const plugins = [...lifeguard.plugins.values()];
    const cmds = plugins
      .map(p => {
        if (p.name === 'dev') {
          return [...p.values()];
        }
        if (
          guildDB?.config.plugins.has(p.name) &&
          guildDB?.config.plugins.get(p.name)?.enabled
        ) {
          return [...p.values()];
        } else {
          return [];
        }
      })
      .reduce((acc, val) => acc.concat(val), []);
    return cmds.find(cmd => cmd.options.alias?.includes(cmdName));
  }
}

export const event = new Event(
  'lifeguardCommandUsed',
  async (lifeguard, msg: Message, dbUser: UserDoc) => {
    if (msg.author.bot) {
      return;
    }
    if (dbUser.blacklisted) {
      return;
    }
    const [cmdName, ...args] = parseContent(msg.content);
    const cmd = await getCommandFromPlugin(
      lifeguard,
      cmdName,
      msg.guild as Guild
    );

    if (cmd) {
      if (msg.member && msg.guild) {
        const userLevel = calcUserLevel(msg.member, msg.guild);
        if (userLevel >= cmd.options.level) {
          cmd.func(lifeguard, msg, args, dbUser);
        }
      }
    }
  }
);
