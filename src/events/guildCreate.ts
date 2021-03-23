import { Event, EventFunc } from "@events/Event.ts";

export default class extends Event<"guildCreate"> {
  name = "guildCreate" as const;
  func: EventFunc<"guildCreate"> = async (ctx, guild) => {
    ctx.logger.info("Lifeguard is ready!");
    const doc = await ctx.db.Guilds.insert({
      id: guild.id,
      blocked: false,
    });
    console.log(doc);
  };
}
