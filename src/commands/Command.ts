import {
  Interaction,
  SlashCommandHandler,
  SlashCommandPartial,
} from "harmony/mod.ts";

import type { LifeguardCtx } from "@src/bot.ts";

export type CommandHandler = (
  ctx: LifeguardCtx,
  i: Interaction
) => Promise<void>;

export abstract class Command implements SlashCommandPartial {
  constructor(
    public name: SlashCommandPartial["name"],
    public description: SlashCommandPartial["description"],
    public options: SlashCommandPartial["options"],
    public handle: CommandHandler
  ) {}
}
