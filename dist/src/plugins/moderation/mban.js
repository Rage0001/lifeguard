"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../Command");
const ban_1 = require("./ban");
exports.command = new Command_1.Command("mban", async (msg, args, bot) => {
    try {
        const lang = bot.langs["en-US"].commands.mban;
        if (args.indexOf("-r") === -1) {
            for (const arg of args) {
                ban_1.command.func(msg, [arg, lang.reason], bot);
            }
        }
        else {
            const argStr = args.join(" ");
            const split = argStr.split("-r");
            const users = split[0].split(" ").filter(u => u !== "");
            const reason = split[1];
            for (const user of users) {
                ban_1.command.func(msg, [user, reason], bot);
            }
        }
    }
    catch (err) {
        bot.logger.error(JSON.stringify(err));
    }
}, {
    guildOnly: true,
    hidden: false,
    level: 0,
    usage: ["mban {users}", "mban {users} -r {reason}"]
});
