import { Redis, RedisConnectOptions, connect } from "redis/mod.ts";

import { Logger } from "@util/Logger.ts";
import { MongoClient } from "mongo/mod.ts";
import { User } from "@database/$schemas";

export interface DatabaseOpts {
  mongo: {
    uri: string;
    dbName: string;
  };
  redis: RedisConnectOptions;
}
export class Database {
  mongo: MongoClient;
  redis!: Redis;
  _db!: ReturnType<MongoClient["database"]>;
  constructor(private opts: DatabaseOpts) {
    this.mongo = new MongoClient();
  }

  get Users(): User {
    return new User(this.redis, this._db.collection("users"));
  }

  get Guilds() {
    return this._db.collection("guilds");
  }

  async connect() {
    try {
      await this.mongo
        .connect(this.opts.mongo.uri)
        .then(() => Logger.info("Connected to MongoDB"));
      this._db = this.mongo.database(this.opts.mongo.dbName);
      this.redis = await connect(this.opts.redis).then((r) => {
        Logger.info("Connected to Redis");
        return r;
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
