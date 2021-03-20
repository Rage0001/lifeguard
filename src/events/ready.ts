import { Event, EventFunc } from "@events/Event.ts";

export default class extends Event<"ready"> {
  name = "ready" as const;
  func: EventFunc<"ready"> = (ctx) => {
    ctx.log("Lifeguard is ready!");
  };
}
