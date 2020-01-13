import { Client, ClientOptions, Collection } from 'discord.js';
import { Plugin } from './plugins/Plugin';

export class PluginClient extends Client {
  plugins!: Collection<string, Plugin>;
  constructor(options?: ClientOptions) {
    super(options);
  }
}
