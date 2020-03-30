import { Message, PermissionString } from 'discord.js';
import { PluginClient } from '@lifeguard/PluginClient';
import { UserDoc } from '@lifeguard/database/User';

type CommandFunction = (
  lifeguard: PluginClient,
  msg: Message,
  args: string[],
  dbUser?: UserDoc
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
