import { name, url } from '@config/mongodb';
import { Plugin } from '@plugins/Plugin';
import { Database } from '@util/Database';
import { Client, ClientOptions, Collection } from 'discord.js';
import * as Cache from 'lru-cache';
import { Level, Logger } from 'verborum';
import { LifeguardEvents } from './events/Event';

interface PendingCacheStore {
  bans: Cache<string, string>;
  unbans: Cache<string, string>;
  kicks: Cache<string, string>;
  cleans: Cache<string, string>;
}

export interface PluginClient {
  on<K extends keyof LifeguardEvents>(
    event: K,
    listener: (...args: LifeguardEvents[K]) => void
  ): this;
  once<K extends keyof LifeguardEvents>(
    event: K,
    listener: (...args: LifeguardEvents[K]) => void
  ): this;
}

export class PluginClient extends Client {
  plugins!: Collection<string, Plugin>;
  db: Database;
  logger: Logger;
  pending: PendingCacheStore;

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
        useKeywords: false,
        info: '#2196F3',
        warning: '#FFEB3B',
        error: '#f44336',
        debug: '#ffffff',
      },
      format: '{{clrst}}[{{lvl}}] {{{msg}}}{{clrend}}',
      levels: [Level.Debug, Level.Error, Level.Info, Level.Warning],
    });

    this.pending = {
      bans: new Cache(100),
      unbans: new Cache(100),
      kicks: new Cache(100),
      cleans: new Cache(100),
    };
  }
}
