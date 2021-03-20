import { Event, EventFunc } from "@events/Event.ts";

export default class extends Event<"debug"> {
  name = "debug" as const;
  func: EventFunc<"debug"> = (ctx, msg) => {
    ctx.logger.debug(msg);
  };
}
