import { Event } from "./Event";

export const event = new Event("debug", async (bot, info: string) => {
  bot.logger.debug(info);
});
