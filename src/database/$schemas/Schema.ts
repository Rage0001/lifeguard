import { Collection } from "mongo/src/collection/collection.ts";
import { Redis } from "redis/mod.ts";

export class Schema<T> {
  constructor(private redis: Redis, public collection: Collection<T>) {}
}
