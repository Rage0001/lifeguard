import { Guild, User } from "@database/$schemas";
import { Redis, RedisConnectOptions, connect } from "redis/mod.ts";

import { Logger } from "@util/Logger.ts";
import { MongoClient } from "mongo/mod.ts";
import { timed } from "@util/timed.ts";

export interface DatabaseOpts {
  mongo: {
    uri: string;
    dbName: string;
  };
  redis: RedisConnectOptions;
  debug?: boolean;
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

  get Guilds(): Guild {
    return new Guild(this.redis, this._db.collection("guilds"));
  }

  async ping() {
    const [redisPing] = await timed(async () => {
      return await this.redis.ping();
    });
    const [mongoPing] = await timed(async () => {
      return await this.mongo.runCommand(this._db.name, {
        ping: 1,
      });
    });
    return {
      redis: redisPing,
      mongo: mongoPing,
    };
  }

  async connect() {
    try {
      await this.mongo
        .connect(this.opts.mongo.uri)
        .then(() => Logger.info("Connected to MongoDB"));
      this._db = this.mongo.database(this.opts.mongo.dbName);
      this.redis = await connect(this.opts.redis).then(async (r) => {
        Logger.info("Connected to Redis");
        if (this.opts.debug) {
          await r.del("users", "guilds");
        }
        await r
          .hset("users", "__exists", "true")
          .catch((err) =>
            console.error('r.hset("users", "__exists", "true")', err)
          );
        await r
          .hset("guilds", "__exists", "true")
          .catch((err) =>
            console.error('r.hset("guilds", "__exists", "true")', err)
          );
        return r;
      });
      await this.Users.loadDocsIntoRedis().then(() =>
        Logger.info("Loaded Exising Users into Redis")
      );
      await this.Guilds.loadDocsIntoRedis().then(() =>
        Logger.info("Loaded Existing Guilds into Redis")
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
