import { Client, ClientOptions, Collection } from 'discord.js';
import { Plugin } from './plugins/Plugin';
import { Database } from './util/Database';
import { name, url } from './config/mongodb';

export class PluginClient extends Client {
  plugins!: Collection<string, Plugin>;
  db: Database;
  constructor(options?: ClientOptions) {
    super(options);
    this.db = new Database({
      name,
      url,
      MongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    });
  }
}
