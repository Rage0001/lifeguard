import { Client, ClientOptions } from "discord.js";
import { Connection } from "mongoose";
import { Plugin } from "../plugins/Plugin";
import { formatter, IReplacer } from "./Formatter";

interface ILanguageObj {
  [s: string]: any;
}

// @ts-ignore
export class PluginClient extends Client {
  public db!: Connection;
  public format: (str: string, replace: IReplacer) => string;
  public langs: ILanguageObj;
  public plugins!: Plugin[];
  constructor(public prefix: string, public options: ClientOptions) {
    super(options);
    this.langs = {};
    this.format = formatter;
  }
}
