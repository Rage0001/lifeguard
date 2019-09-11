"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const User_1 = require("../../models/User");
const Command_1 = require("../Command");
exports.command = new Command_1.Command("inf", async (msg, args, bot) => {
    const lang = bot.langs["en-US"].commands.inf;
    switch (args[0]) {
        case "search":
            const user = await User_1.findUser(args[1]);
            if (user) {
                const infs = user.get("infractions");
                bot.logger.debug(infs);
            }
            else {
                const embed = new discord_js_1.RichEmbed({
                    description: lang.errors.noUser
                });
                msg.channel.send(embed);
            }
            break;
    }
}, {
    guildOnly: true,
    hidden: false,
    level: 2,
    usage: ["inf"]
});
