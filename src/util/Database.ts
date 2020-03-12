// import { connect, Db, MongoClientOptions, Collection } from 'mongodb';
// import { User } from '../models/User';
// import { Guild } from '../models/Guild';

// interface DatabaseConfig {
//   url: string;
//   name: string;
//   MongoOptions?: MongoClientOptions;
// }

// export class Database {
//   db!: Db;
//   constructor(protected config: DatabaseConfig) {}

//   async connect() {
//     const client = await connect(
//       this.config.url,
//       this.config.MongoOptions
//     ).catch(err => {
//       throw err;
//     });
//     this.db = client.db(this.config.name);
//   }

//   get guilds(): Collection<Guild> {
//     return this.db.collection('guilds');
//   }

//   get users(): Collection<User> {
//     return this.db.collection('users');
//   }
// }

import { connect, ConnectionOptions, connection } from 'mongoose';
import { guild } from '@lifeguard/database/Guild';
import { user } from '@lifeguard/database/User';
import { infraction } from '@lifeguard/database/Infraction';

interface DatabaseConfig {
  url: string;
  name: string;
  MongoOptions: ConnectionOptions;
}

export class Database {
  constructor(protected config: DatabaseConfig) {}

  async connect() {
    await connect(this.config.url, {
      dbName: this.config.name,
      ...this.config.MongoOptions,
    });
  }

  get guilds() {
    return guild;
  }

  get users() {
    return user;
  }

  get infractions() {
    return infraction;
  }
}