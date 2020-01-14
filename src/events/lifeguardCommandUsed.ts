import { Event } from './Event';
import { Message } from 'discord.js';
import { prefix } from '../config/bot';
import { PluginClient } from '../PluginClient';
import { calcUserLevel } from '../assertions/userLevel';

function parseContent(content: string) {
  const split = content.split(' ');
  const cmdName = split[0].slice(prefix.length);
  split.shift();
  return [cmdName, ...split];
}

function getCommandFromPlugin(lifeguard: PluginClient, cmdName: string) {
  const plugin = lifeguard.plugins.find(p => p.has(cmdName));
  const command = plugin?.get(cmdName);
  return command;
}

export const event = new Event(
  'lifeguardCommandUsed',
  async (lifeguard, msg: Message) => {
    const [cmdName, ...args] = parseContent(msg.content);
    const cmd = getCommandFromPlugin(lifeguard, cmdName);

    if (cmd) {
      if (msg.member && msg.guild) {
        const userLevel = calcUserLevel(msg.member, msg.guild);
        if (userLevel >= cmd.options.level) {
          cmd.func(lifeguard, msg, args);
        }
      }
    }
  }
);
