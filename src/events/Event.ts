import { ClientEvents } from "harmony/mod.ts";
import type { LifeguardCtx } from "@src/bot.ts";

export type EventFunc<K extends keyof ClientEvents> = (
  ctx: LifeguardCtx,
  ...args: ClientEvents[K]
) => void;
export abstract class Event<K extends keyof ClientEvents> {
  constructor(public name: K, public func: EventFunc<K>) {}
}
