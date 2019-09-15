"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Sentry = __importStar(require("@sentry/node"));
const discord_js_1 = require("discord.js");
const Database_1 = require("./src/helpers/Database");
const EventLoader_1 = require("./src/helpers/EventLoader");
const LangLoader_1 = require("./src/helpers/LangLoader");
const Logger_1 = __importDefault(require("./src/helpers/Logger"));
const PluginClient_1 = require("./src/helpers/PluginClient");
const PluginLoader_1 = require("./src/helpers/PluginLoader");
const config_1 = require("./src/private/config");
if (config_1.config.dsn) {
    Sentry.init({ dsn: config_1.config.dsn });
}
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
    Logger_1.default.info("Connected to Discord.");
    if (process.send) {
        process.send(["start"]);
    }
    const userCount = await bot.shard.fetchClientValues("users.size")
        .catch((err) => {
        Logger_1.default.error(err);
    });
    bot.user.setPresence({
        game: {
            name: bot.format(bot.langs.default.status, {
                prefix: `${bot.prefix}`,
                // users: `${userCount.reduce((prev, shardUserCount) => prev + shardUserCount, 0)}`
                users: `${bot.users.size}`
            }),
            type: "WATCHING"
        }
    });
});
bot.login(config_1.config.token);
// Restart Completed Notifier
process.on("message", async (message) => {
    if (message[0] === "restartSuccess") {
        const lang = bot.langs["en-US"].commands.restart;
        const embed = new discord_js_1.RichEmbed({
            description: lang.restarted,
            title: lang.title
        });
        embed.setTimestamp();
        (bot.guilds.find((guild) => {
            return guild.channels.has(message[1]);
        }).channels.find((channel) => {
            return channel.id === message[1];
        })).send(embed);
    }
});
process.on("unhandledRejection", (err) => {
    if (err) {
        Logger_1.default.error(JSON.stringify(err));
    }
});
process.on("uncaughtException", (err) => {
    if (err.stack) {
        Logger_1.default.error(err.stack);
    }
    else {
        Logger_1.default.error(err.message);
    }
});
