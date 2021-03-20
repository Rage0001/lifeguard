import { Client, GatewayIntents } from "harmony/mod.ts";

export class Lifeguard extends Client {
  constructor() {
    super({
      intents: [GatewayIntents.GUILDS, GatewayIntents.GUILD_MESSAGES],
    });
  }
}

export interface LifeguardCtx {
  lifeguard: Lifeguard;
}
