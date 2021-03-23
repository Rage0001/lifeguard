import { Event, EventFunc } from "@events/Event.ts";

export default class extends Event<"ready"> {
  name = "ready" as const;
  func: EventFunc<"ready"> = async (ctx) => {
    ctx.logger.info("Lifeguard is ready!");
    // Insert Lifeguard User into the Database
    await ctx.db.Users.insert({
      id: ctx.lifeguard.user?.id!,
      blocked: false,
    });
  };
}
