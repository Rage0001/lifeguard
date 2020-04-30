import { connect, ConnectionOptions, disconnect, Model } from 'mongoose';
import { guild, GuildDoc } from '@lifeguard/database/Guild';
import { user, UserDoc } from '@lifeguard/database/User';
import { infraction, InfractionDoc } from '@lifeguard/database/Infraction';
import { promisify } from 'util';

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

  disconnect(): Promise<any> {
    return new Promise((res, rej) => {
      disconnect((err) => {
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
