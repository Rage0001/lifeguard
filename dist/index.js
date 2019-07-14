"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = require("./src/helpers/Database");
const EventLoader_1 = require("./src/helpers/EventLoader");
const LangLoader_1 = require("./src/helpers/LangLoader");
const PluginClient_1 = require("./src/helpers/PluginClient");
const PluginLoader_1 = require("./src/helpers/PluginLoader");
const config_1 = require("./src/private/config");
async function runLoaders() {
    const langsErr = await LangLoader_1.loadLangs(bot);
    if (langsErr) {
        console.error(langsErr);
    }
    const eventsErr = await EventLoader_1.loadEvents(bot);
    if (eventsErr) {
        console.error(eventsErr);
    }
    const plugins = await PluginLoader_1.loadPlugins();
    if (Array.isArray(plugins)) {
        bot.plugins = plugins;
    }
    else {
        console.error(plugins);
    }
}
const bot = new PluginClient_1.PluginClient(config_1.config.prefix, {
    fetchAllMembers: true
});
bot.prefix = config_1.config.prefix;
bot.once("ready", async () => {
    await runLoaders();
    bot.db = Database_1.connect();
    bot.user.setPresence({
        game: {
            name: bot.format(bot.langs.default.status, {
                prefix: `${bot.prefix}`,
                users: `${bot.users.size}`
            }),
            type: "WATCHING"
        }
    });
    console.log("Ready!");
});
bot.login(config_1.config.token);
