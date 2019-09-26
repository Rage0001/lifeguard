import { Client, ClientOptions } from "discord.js";
import { Connection } from "mongoose";
import { Plugin } from "../plugins/Plugin";
import { formatter, IReplacer } from "./Formatter";
import Logger, { ILogger } from "./Logger";

interface ILanguageObj {
  [s: string]: any;
}

interface IPendingEvent {
  event: string;
  args: any[];
}

// @ts-ignore
export class PluginClient extends Client {
  public db!: Connection;
  public format: (str: string, replace: IReplacer) => string;
  public logger: ILogger;
  public langs: ILanguageObj;
  public pendingEvents: IPendingEvent[];
  public plugins!: Plugin[];

  constructor(public prefix: string, public options: ClientOptions) {
    super(options);
    this.logger = Logger;
    this.langs = {};
    this.format = formatter;
    this.pendingEvents = [];
  }

  public restart(channelID: string) {
    this.shard.send(["restart", channelID]);
    if (process.send) {
      process.send(["restart", channelID]);
    }
  }

  public addEvent(event: IPendingEvent) {
    this.pendingEvents.push(event);
  }

  public removeEvent(event: IPendingEvent) {
    this.pendingEvents = this.pendingEvents.filter(e => e !== event);
  }
}
