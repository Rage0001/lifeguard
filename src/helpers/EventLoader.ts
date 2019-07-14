import { readdir } from "fs";
import { promisify } from "util";
import { PluginClient } from "./PluginClient";

export async function loadEvents(bot: PluginClient) {
  try {
    const readDir = promisify(readdir);

    const items = await readDir("./dist/src/events");

    for await (const item of items) {
      if (item !== "Event.js") {
        const { event } = require(`../events/${item}`);
        bot.on(event.name, (...args) => {
          event.func(bot, ...args);
        });
      }
    }
  } catch (err) {
    return {
      location: "Event Loader",
      message: err
    };
  }
}
