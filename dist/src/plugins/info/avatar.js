"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const parseUser_1 = require("../../helpers/parseUser");
const Command_1 = require("../Command");
exports.command = new Command_1.Command("avatar", async (msg, args, bot) => {
    const avatar = args[0] ? (await bot.fetchUser(parseUser_1.parseUser(args[0]))).avatarURL : msg.author.avatarURL;
    const embed = new discord_js_1.RichEmbed();
    embed.setImage(avatar);
    msg.channel.send(embed);
}, {
    guildOnly: false,
    hidden: false,
    level: 0,
    usage: ["avatar", "avatar <user>"]
});
