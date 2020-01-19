import { connect, Db, MongoClientOptions } from 'mongodb';

interface DatabaseConfig {
  url: string;
  name: string;
  MongoOptions?: MongoClientOptions;
}

export class Database {
  db!: Db;
  constructor(protected config: DatabaseConfig) {}

  async connect() {
    const client = await connect(
      this.config.url,
      this.config.MongoOptions
    ).catch(err => {
      throw err;
    });
    this.db = client.db(this.config.name);
  }

  get guilds() {
    return this.db.collection('guilds');
  }

  get users() {
    return this.db.collection('users');
  }
}
