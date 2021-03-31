import { Command, CommandHandler } from "./Command.ts";

import { Embed } from "harmony/mod.ts";

export default class extends Command {
  name = "ping";
  description = "Pings the bot to see if it is alive.";
  handle: CommandHandler = async (ctx, i) => {
    const dbPing = await ctx.db.ping();
    i.respond({
      embeds: [
        new Embed().addFields(
          {
            name: "WS Ping:",
            value: `${ctx.lifeguard.ping}ms`,
          },
          {
            name: "Redis Ping:",
            value: `${dbPing.redis.toFixed(2)}ms`,
          },
          {
            name: "MongoDB Ping:",
            value: `${dbPing.mongo.toFixed(2)}ms`,
          }
        ),
      ],
    });
  };
}
