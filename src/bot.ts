import { Client, ClientEvents, GatewayIntents } from "harmony/mod.ts";
import { Database, DatabaseOpts } from "@database/Database.ts";

import { Event } from "@events/Event.ts";
import { Logger } from "@util/Logger.ts";
import { Module } from "@modules/Module.ts";

export interface LifeguardCtx {
  lifeguard: Lifeguard;
  logger: Logger;
  db: Database;
}

export interface LifeguardOpts {
  debug: boolean;
  db: DatabaseOpts;
}
export class Lifeguard extends Client {
  #ctx: LifeguardCtx;
  logger: Logger;
  db: Database;
  modules: Map<Module["name"], Module>;
  constructor(public opts: LifeguardOpts) {
    super({
      intents: [GatewayIntents.GUILDS, GatewayIntents.GUILD_MESSAGES],
    });
    this.logger = new Logger(this.opts.debug);
    this.db = new Database(this.opts.db);
    this.db.connect().catch((err) => {
      throw this.logger.error("Failed to connect to the Database(s)", err);
    });
    this.modules = new Map();
    this.#ctx = {
      lifeguard: this,
      logger: this.logger,
      db: this.db,
    };
  }

  emit<E extends keyof ClientEvents>(event: E, ...args: ClientEvents[E]) {
    return super.emit(event, ...args);
  }

  async loadEvents() {
    for await (const dirEntry of Deno.readDir("./src/events")) {
      if (!dirEntry.isFile) continue;
      if (dirEntry.name === "Event.ts") continue;
      const event: Event<keyof ClientEvents> = new (
        await import(`@events/${dirEntry.name}`)
      ).default();
      this.on(event.name, (...args) => event.func(this.#ctx, ...args));
    }
  }

  async loadModules() {
    for await (const dirEntry of Deno.readDir("./src/modules")) {
      if (!dirEntry.isDirectory) continue;
      const module = new Module(this.#ctx, dirEntry.name);
      await module
        .instansiate()
        .then(() => this.logger.debug(`Loaded Module: ${module.name}`));
      this.modules.set(module.name, module);
    }
  }
}
