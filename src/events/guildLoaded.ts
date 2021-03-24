import { Event, EventFunc } from "@events/Event.ts";

export default class extends Event<"guildLoaded"> {
  name = "guildLoaded" as const;
  func: EventFunc<"guildLoaded"> = async (ctx, guild) => {
    const doc = await ctx.db.Guilds.insert({
      id: guild.id,
      blocked: false,
    });
    ctx.logger.debug(JSON.stringify(doc));
  };
}
