import { readdir } from "fs";
import { promisify } from "util";
import { PluginClient } from "./PluginClient";

export async function loadLangs(bot: PluginClient) {
  try {
    const readDir = promisify(readdir);

    const files = await readDir("./dist/src/lang");

    for await (const file of files) {
      const lang = require(`../lang/${file}`);
      const locale = file.split(".json")[0];
      bot.langs[locale] = lang;
    }
  } catch (err) {
    return {
      location: "Language Loader",
      message: err
    };
  }
}
