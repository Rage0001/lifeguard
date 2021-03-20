import { Client, ClientEvents, GatewayIntents } from "harmony/mod.ts";

import { Event } from "@events/Event.ts";

export class Lifeguard extends Client {
  constructor() {
    super({
      intents: [GatewayIntents.GUILDS, GatewayIntents.GUILD_MESSAGES],
    });
  }

  async loadEvents() {
    for await (const dirEntry of Deno.readDir("./src/events")) {
      if (!dirEntry.isFile) continue;
      if (dirEntry.name === "Event.ts") continue;
      const event: Event<keyof ClientEvents> = new (
        await import(`@events/${dirEntry.name}`)
      ).default();
      this.on(event.name, (...args) =>
        event.func({ lifeguard: this, log: console.log }, ...args)
      );
    }
  }
}

export interface LifeguardCtx {
  lifeguard: Lifeguard;
  log: Console["log"];
}
