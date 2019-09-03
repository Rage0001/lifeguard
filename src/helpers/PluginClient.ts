import { Client, ClientOptions, GuildMember } from "discord.js";
import { Connection } from "mongoose";
import { Plugin } from "../plugins/Plugin";
import { formatter, IReplacer } from "./Formatter";
import Logger, { ILogger } from "./Logger";

interface ILanguageObj {
  [s: string]: any;
}

// @ts-ignore
export class PluginClient extends Client {
  public db!: Connection;
  public format: (str: string, replace: IReplacer) => string;
  public logger: ILogger;
  public langs: ILanguageObj;
  public plugins!: Plugin[];

  constructor(public prefix: string, public options: ClientOptions) {
    super(options);
    this.logger = Logger;
    this.langs = {};
    this.format = formatter;
  }

  public restart(channelID: string) {
    if (process.send) {
      process.send(["restart", channelID]);
    }
  }
}
