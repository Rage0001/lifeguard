import {ConnectionOptions, Model, connect, disconnect} from 'mongoose';
import {GuildDoc, guild} from '@lifeguard/database/Guild';
import {InfractionDoc, infraction} from '@lifeguard/database/Infraction';
import {UserDoc, user} from '@lifeguard/database/User';

interface DatabaseConfig {
  url: string;
  name: string;
  MongoOptions: ConnectionOptions;
}

export class Database {
  constructor(protected config: DatabaseConfig) {}

  async connect(): Promise<void> {
    await connect(this.config.url, {
      dbName: this.config.name,
      ...this.config.MongoOptions,
    });
  }

  disconnect(): Promise<void> {
    return new Promise((res, rej) => {
      disconnect(err => {
        if (err) {
          rej(err);
        } else {
          res();
        }
      });
    });
  }

  get guilds(): Model<GuildDoc> {
    return guild;
  }

  get users(): Model<UserDoc> {
    return user;
  }

  get infractions(): Model<InfractionDoc> {
    return infraction;
  }
}
