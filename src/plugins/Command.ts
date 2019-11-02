import { Message, PermissionObject } from "discord.js";
import { PluginClient } from "../helpers/PluginClient";
import { Store } from "../helpers/Store";
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
  public subcommands: Store<Command>;
  constructor(
    public name: string,
    public func: CommandFunction,
    public options: ICommandOptions
  ) {
    this.subcommands = new Store<Command>();
  }
  public addSubcommand(name: string, cmd: Command) {
    this.subcommands.set(name, cmd);
  }
}
