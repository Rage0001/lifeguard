import * as Cache from 'lru-cache';

import {Client, ClientOptions, Collection, TextChannel} from 'discord.js';
import {Level, Logger} from 'verborum';
import {name, url} from '@config/mongodb';

import {Database} from '@util/Database';
import {LifeguardEvents} from './events/Event';
import {Plugin} from '@plugins/Plugin';
import {assert} from './util/assert';

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
  emit<K extends keyof LifeguardEvents>(
    event: K,
    ...args: LifeguardEvents[K]
  ): boolean;
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

  async getLogChannels(guildID: string, eventName: keyof LifeguardEvents) {
    const guild = this.guilds.resolve(guildID);
    const dbGuild = await this.db.guilds.findById(guildID);
    if (dbGuild?.config.logging.enabled) {
      return [...dbGuild.config.logging.channels.entries()]
        .filter(v => v[1].includes(eventName))
        .map(v => v[0])
        .map(id => {
          const channel = guild?.channels.resolve(id);
          assert(
            channel instanceof TextChannel,
            `${channel} is not a TextChannel`
          );
          return channel;
        });
    } else return [];
  }
}
