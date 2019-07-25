"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = require("./src/helpers/Database");
const EventLoader_1 = require("./src/helpers/EventLoader");
const LangLoader_1 = require("./src/helpers/LangLoader");
const Logger_1 = __importDefault(require("./src/helpers/Logger"));
const PluginClient_1 = require("./src/helpers/PluginClient");
const PluginLoader_1 = require("./src/helpers/PluginLoader");
const config_1 = require("./src/private/config");
async function runLoaders() {
    const langsErr = await LangLoader_1.loadLangs(bot);
    if (langsErr) {
        Logger_1.default.error(langsErr.message);
    }
    const eventsErr = await EventLoader_1.loadEvents(bot);
    if (eventsErr) {
        Logger_1.default.error(eventsErr.message);
    }
    const plugins = await PluginLoader_1.loadPlugins();
    if (Array.isArray(plugins)) {
        bot.plugins = plugins;
    }
    else {
        Logger_1.default.error(plugins.message);
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
    Logger_1.default.info("Connected to Discord.");
});
bot.login(config_1.config.token);