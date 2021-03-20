import { Client, ClientEvents, GatewayIntents } from "harmony/mod.ts";

import { Event } from "@events/Event.ts";
import { Logger } from "@util/Logger.ts";

export interface LifeguardCtx {
  lifeguard: Lifeguard;
  logger: Logger;
}

export class Lifeguard extends Client {
  #ctx: LifeguardCtx;
  constructor() {
    super({
      intents: [GatewayIntents.GUILDS, GatewayIntents.GUILD_MESSAGES],
    });
    this.#ctx = {
      lifeguard: this,
      logger: new Logger(),
    };
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
}
