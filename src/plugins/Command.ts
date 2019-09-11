import { Message, PermissionObject } from "discord.js";
import { PluginClient } from "../helpers/PluginClient";
import { IGuildDoc } from "../models/Guild";

type CommandFunction = (
  msg: Message,
  args: string[],
  bot: PluginClient,
  guildConfig?: IGuildDoc
) => void;

interface ICommandOptions {
  aliases?: string[];
  guildOnly: boolean;
  hidden: boolean;
  level: number;
  usage: string[];
  permissions?: PermissionObject;
}

export class Command {
  constructor(
    public name: string,
    public func: CommandFunction,
    public options: ICommandOptions
  ) {}
}
