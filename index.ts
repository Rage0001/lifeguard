import { connect } from "./src/helpers/Database";
import { loadEvents } from "./src/helpers/EventLoader";
import { loadLangs } from "./src/helpers/LangLoader";
import Logger from "./src/helpers/Logger";
import { PluginClient } from "./src/helpers/PluginClient";
import { loadPlugins } from "./src/helpers/PluginLoader";
import { config } from "./src/private/config";

async function runLoaders() {
  const langsErr = await loadLangs(bot);
  if (langsErr) {
    Logger.error(langsErr.message);
  }
  const eventsErr = await loadEvents(bot);
  if (eventsErr) {
    Logger.error(eventsErr.message);
  }
  const plugins = await loadPlugins();
  if (Array.isArray(plugins)) {
    bot.plugins = plugins;
  } else {
    Logger.error(plugins.message);
  }
}

const bot = new PluginClient(config.prefix, {
  fetchAllMembers: true
});

bot.prefix = config.prefix;

bot.once("ready", async () => {
  await runLoaders();
  bot.db = connect();
  bot.user.setPresence({
    game: {
      name: bot.format(bot.langs.default.status, {
        prefix: `${bot.prefix}`,
        users: `${bot.users.size}`
      }),
      type: "WATCHING"
    }
  });
  Logger.info("Connected to Discord.");
});

bot.login(config.token);
