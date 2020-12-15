import {Guild, Message, TextChannel} from 'discord.js';

import {Event} from '@events/Event';
import {PluginClient} from '@lifeguard/PluginClient';
import {UserDoc} from '@lifeguard/database/User';
import {calcUserLevel} from '@assertions/userLevel';
import {filterUndefined} from '@lifeguard/util/filterUndefined';
import {parseUser} from '@lifeguard/util/parseUser';
import {prefix} from '@config/bot';

function parseContent(content: string) {
  const split = content.split(' ');
  const cmdName = split[0].slice(prefix.length).toLowerCase();
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
    if (plugin.name === 'dev') {
      return plugin?.get(cmdName);
    }
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
    if (dbUser.blocked) {
      return;
    }
    const [cmdName, ..._args] = parseContent(msg.content);
    const cmd = await getCommandFromPlugin(
      lifeguard,
      cmdName,
      msg.guild as Guild
    );

    if (cmd) {
      if (msg.member && msg.guild) {
        const userLevel = calcUserLevel(msg.member, msg.guild);
        if (userLevel >= cmd.options.level) {
          const sendInvalidArg = (argType: string, ind: number) =>
            msg.channel.send(
              `Invalid argument at position ${ind}\nCannot convert \`${_args[ind]}\` to ${argType}`
            );
          if (cmd.options.expectedArgs) {
            if (
              _args.length <
              cmd.options.expectedArgs.filter(arg => !arg.endsWith('?')).length
            ) {
              msg.channel.send(
                `Expected ${
                  cmd.options.expectedArgs.filter(arg => !arg.endsWith('?'))
                    .length
                } arguments but received ${_args.length}`
              );
            } else {
              const argCasts = cmd.options.expectedArgs.map((argType, ind) => {
                let tmp;
                let strTemp: string;
                switch (argType) {
                  case 'string':
                  case 'string?':
                    if (argType.endsWith('?') && !_args[ind]) return null;
                    if (typeof _args[ind] === 'string') return _args[ind];
                    else {
                      sendInvalidArg(argType, ind);
                      return undefined;
                    }

                  case 'number':
                  case 'number?':
                    if (argType.endsWith('?') && !_args[ind]) return null;
                    tmp = Number(_args[ind]);
                    if (tmp) return tmp;
                    else {
                      sendInvalidArg(argType, ind);
                      return undefined;
                    }

                  case 'boolean':
                  case 'boolean?':
                    if (argType.endsWith('?') && !_args[ind]) return null;
                    tmp = Boolean(_args[ind]);
                    if (tmp) return tmp ? true : false;
                    else {
                      sendInvalidArg(argType, ind);
                      return undefined;
                    }

                  case 'guild':
                  case 'guild?':
                    if (argType.endsWith('?') && !_args[ind]) return null;
                    tmp = lifeguard.guilds.cache.find(g => g.id === _args[ind]);
                    if (tmp) return tmp;
                    else {
                      sendInvalidArg(argType, ind);
                      return undefined;
                    }

                  case 'user':
                  case 'user?':
                    if (argType.endsWith('?') && !_args[ind]) return null;
                    strTemp = parseUser(_args[ind]);
                    tmp = lifeguard.users.cache.find(u => u.id === strTemp);
                    if (tmp) return tmp;
                    else {
                      sendInvalidArg(argType, ind);
                      return undefined;
                    }

                  case 'channel':
                  case 'channel?':
                    if (argType.endsWith('?') && !_args[ind]) return null;
                    tmp = lifeguard.channels.cache.find(
                      c => c.id === _args[ind]
                    );
                    if (tmp) return tmp;
                    else {
                      sendInvalidArg(argType, ind);
                      return undefined;
                    }

                  case 'textchannel':
                  case 'textchannel?':
                    if (argType.endsWith('?') && !_args[ind]) return null;
                    tmp = lifeguard.channels.cache.find(
                      c => c.id === _args[ind]
                    );
                    if (tmp instanceof TextChannel) return tmp;
                    else {
                      sendInvalidArg(argType, ind);
                      return undefined;
                    }

                  default:
                    return _args[ind];
                }
              });
              if (argCasts?.includes(undefined)) return;
              const args = [
                ...argCasts.filter(filterUndefined),
                ..._args.slice(argCasts?.length),
              ];
              cmd.func(lifeguard, msg, args, dbUser);
            }
          } else cmd.func(lifeguard, msg, _args, dbUser);
        }
      }
    }
  }
);
