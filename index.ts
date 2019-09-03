import { RichEmbed, TextChannel } from "discord.js";
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
  if (process.send) {
    process.send(["start"]);
  }
});

bot.login(config.token);

// Restart Completed Notifier
process.on("message", (message: string[]) => {
  if (message[0] === "restartSuccess") {
    const lang = bot.langs["en-US"].commands.restart;
    const embed = new RichEmbed({
      description: lang.restarted,
      title: lang.title
    });
    embed.setTimestamp();
    ((bot.guilds.find((guild) => {
      return guild.channels.has(message[1]);
    }).channels.find((channel) => {
      return channel.id === message[1];
    })) as TextChannel).send(embed);
  }
});
