import { Command, CommandHandler } from "@modules/Command.ts";

import { Embed } from "harmony/mod.ts";

export default class extends Command {
  name = "ping";
  description = "Pings the bot to see if it is alive.";
  handler: CommandHandler = async (ctx, i) => {
    const { redis, mongo } = await ctx.db.ping();
    i.respond({
      embeds: [
        new Embed().addFields(
          {
            name: "WS Ping:",
            value: `${ctx.lifeguard.ping}ms`,
          },
          {
            name: "Redis Ping:",
            value: `${redis.toFixed(2)}ms`,
          },
          {
            name: "MongoDB Ping:",
            value: `${mongo.toFixed(2)}ms`,
          }
        ),
      ],
    });
  };
}
