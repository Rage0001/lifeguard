"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../Command");
exports.command = new Command_1.Command("clean", async (msg, args, bot) => {
    const lang = bot.langs["en-US"].commands.clean;
    switch (args[0].toLowerCase()) {
        case "all":
            break;
        default:
            msg.channel.send(lang.nonValidArgument);
            break;
    }
}, {
    guildOnly: true,
    hidden: false,
    level: 2,
    usage: [
        "clean all {amount}",
        "clean user {userid} {amount}",
        "clean bots {amount}",
        "clean until {messageid}",
        "clean between {messageid} {messageid}"
    ]
});
