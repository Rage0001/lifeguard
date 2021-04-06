import { Bson } from "mongo/mod.ts";
import { Collection } from "mongo/src/collection/collection.ts";
import { Redis } from "redis/mod.ts";

export interface DefaultSchema {
  id: string;
}
export abstract class Schema<T extends DefaultSchema> {
  constructor(private redis: Redis, public collection: Collection<T>) {}
  async loadDocsIntoRedis() {
    try {
      const docs = await this.collection.find({});
      docs.forEach(async (doc) => {
        await this.redis.hset(
          this.collection.name,
          doc.id,
          JSON.stringify(doc)
        );
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  exists(id: T["id"]) {
    try {
      return this.redis.hexists(this.collection.name, id);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getAll(): Promise<Map<string, T>> {
    try {
      const all = await this.redis.hgetall(this.collection.name);
      return new Map(
        (all.reduce((res, item, ind) => {
          const chunkInd = Math.floor(ind / 2);
          if (!res[chunkInd]) {
            res[chunkInd] = [] as string[];
          }
          res[chunkInd].push(item);
          return res;
        }, [] as string[][]) as [string, string][])
          .filter(([k, v]) => !k.startsWith("_"))
          .map(([k, v]) => [k, JSON.parse(v)])
      );
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async findByID(id: T["id"], cache?: boolean): Promise<T> {
    try {
      cache = cache !== undefined ? cache : true;
      const cached = await this.exists(id);
      if (cache && Boolean(cached)) {
        return JSON.parse((await this.redis.hget(this.collection.name, id))!);
      } else {
        const fetched = await this.collection.findOne({ id });
        await this.redis.hset(
          this.collection.name,
          fetched!.id,
          JSON.stringify(fetched)
        );
        return fetched!;
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async updateByID(id: T["id"], update: Partial<T>): Promise<T> {
    await this.collection.updateOne({ id }, update, {
      upsert: true,
    });
    return await this.findByID(id, false);
  }

  async insert(doc: T): Promise<T> {
    try {
      const exists = await this.exists(doc.id);
      if (exists) {
        return await this.findByID(doc.id, true);
      } else {
        await this.collection.insertOne(doc);
        return await this.findByID(doc.id, false);
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
