import { Client, ClientEvents, GatewayIntents } from "harmony/mod.ts";
import { Database, DatabaseOpts } from "@database/Database.ts";

import { Command } from "@commands/Command.ts";
import { Event } from "@events/Event.ts";
import { Logger } from "@util/Logger.ts";

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
  constructor(public opts: LifeguardOpts) {
    super({
      intents: [GatewayIntents.GUILDS, GatewayIntents.GUILD_MESSAGES],
    });
    this.logger = new Logger(this.opts.debug);
    this.db = new Database(this.opts.db);
    this.db.connect().catch((err) => {
      throw this.logger.error("Failed to connect to the Database(s)", err);
    });
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

  async loadCommands() {
    for await (const dirEntry of Deno.readDir("./src/commands")) {
      if (!dirEntry.isFile) continue;
      if (dirEntry.name === "Command.ts") continue;
      const command: Command = new (
        await import(`@commands/${dirEntry.name}`)
      ).default();
      const cmd = await this.slash.commands
        .create(command)
        .catch((err) =>
          this.logger.error(`Command Register: ${command.name}`, err)
        );
      if (cmd) {
        cmd.handle((i) => {
          command.handle(this.#ctx, i);
        });
      }
      // this.on(event.name, (...args) => event.func(this.#ctx, ...args));
    }
  }
}
