import { name, url } from '@config/mongodb';
import { Plugin } from '@plugins/Plugin';
import { Database } from '@util/Database';
import { Client, ClientOptions, Collection } from 'discord.js';
import { Level, Logger } from 'verborum';

export class PluginClient extends Client {
  plugins!: Collection<string, Plugin>;
  db: Database;
  logger: Logger;
  constructor(options?: ClientOptions) {
    super(options);
    this.db = new Database({
      name,
      url,
      MongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      },
    });
    this.logger = new Logger('Lifeguard', {
      colorScheme: {
        useKeywords: false, // if this is true, it'll use CSS keywords instead of hex values
        info: '#2196F3', // material blue
        warning: '#FFEB3B', // material yellow
        error: '#f44336', // material red
        debug: '#ffffff', // white
      },
      format: '{{clrst}}[{{lvl}}] {{msg}}{{clrend}}',
      levels: [Level.Debug, Level.Error, Level.Info, Level.Warning],
    });
  }
}
