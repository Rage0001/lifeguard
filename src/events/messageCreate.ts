import { Event, EventFunc } from "@events/Event.ts";

export default class extends Event<"messageCreate"> {
  name = "messageCreate" as const;
  func: EventFunc<"messageCreate"> = (ctx, msg) => {
    ctx.logger.debug(`${msg.author.tag} said ${msg.content}`);
  };
}
