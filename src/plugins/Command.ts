import { Message, PermissionString } from 'discord.js';
import { PluginClient } from '../PluginClient';

type CommandFunction = (
  lifeguard: PluginClient,
  msg: Message,
  args: string[]
) => void;

interface CommandOptions {
  alias?: string[];
  guildOnly?: boolean;
  hidden?: boolean;
  level: number;
  usage: string[];
  permissions?: PermissionString[];
}

export class Command {
  constructor(
    public name: string,
    public func: CommandFunction,
    public options: CommandOptions
  ) {}
}
