"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const discord_js_1 = require("discord.js");
const Command_1 = require("../Command");
exports.command = new Command_1.Command("cat", async (msg, args, bot, guildConfig) => {
    try {
        const data = await axios_1.default.get("https://api.thecatapi.com/v1/images/search?size=large&has_breeds=true");
        const cat = data.data[0];
        const embed = new discord_js_1.RichEmbed({
            description: cat.breeds[0].description,
            image: {
                url: cat.url
            },
            title: cat.breeds[0].name
        });
        msg.channel.send(embed);
    }
    catch (err) {
        bot.logger.error(JSON.stringify(err));
    }
}, {
    guildOnly: true,
    hidden: false,
    level: 0,
    usage: ["cat"]
});
