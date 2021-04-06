import { Event, EventFunc } from "@events/Event.ts";

export default class extends Event<"guildLoaded"> {
  name = "guildLoaded" as const;
  func: EventFunc<"guildLoaded"> = async (ctx, guild) => {
    const doc = await ctx.db.Guilds.insert({
      id: guild.id,
      blocked: false,
    });
    ctx.logger.debug(JSON.stringify(doc));

    // Register Commands
    ctx.logger.debug("<ctx.lifeguard.modules>:", ctx.lifeguard.modules);
    for (const [, module] of ctx.lifeguard.modules) {
      module
        .register(guild.id)
        .then(() =>
          ctx.logger.debug(
            `Registed Module ${module.name} for guild ${guild.id}`
          )
        )
        .catch((err) =>
          ctx.logger.error(
            `Failed to register Module ${module.name} for guild ${guild.id}`,
            err
          )
        );
    }
  };
}
