import {
  Channel,
  Guild,
  Message,
  PermissionString,
  TextChannel,
  User,
} from 'discord.js';

import {PluginClient} from '@lifeguard/PluginClient';
import {UserDoc} from '@lifeguard/database/User';

type CommandArgs =
  | string
  | number
  | boolean
  | null
  | User
  | Guild
  | Channel
  | TextChannel;

type CommandFunction<A extends CommandArgs[] = CommandArgs[]> = (
  lifeguard: PluginClient,
  msg: Message,
  args: A,
  dbUser?: UserDoc
) => void;

interface CommandOptions {
  alias?: string[];
  guildOnly?: boolean;
  hidden?: boolean;
  level: number;
  usage: string[];
  permissions?: PermissionString[];
  expectedArgs?: (
    | 'string'
    | 'number'
    | 'boolean'
    | 'user'
    | 'guild'
    | 'channel'
    | 'textchannel'
    | 'string?'
    | 'number?'
    | 'boolean?'
    | 'user?'
    | 'guild?'
    | 'channel?'
    | 'textchannel?'
  )[];
  // expectedArgs: string[];
}

export class Command<A extends CommandArgs[] = CommandArgs[]> {
  constructor(
    public name: string,
    public func: CommandFunction<A>,
    public options: CommandOptions
  ) {}
}
