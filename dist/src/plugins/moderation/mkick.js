"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../Command");
const kick_1 = require("./kick");
exports.command = new Command_1.Command("mkick", async (msg, args, bot) => {
    try {
        const lang = bot.langs["en-US"].commands.mkick;
        if (args.indexOf("-r") === -1) {
            for (const arg of args) {
                kick_1.command.func(msg, [arg, lang.reason], bot);
            }
        }
        else {
            const argStr = args.join(" ");
            const split = argStr.split("-r");
            const users = split[0].split(" ").filter(u => u !== "");
            const reason = split[1];
            for (const user of users) {
                kick_1.command.func(msg, [user, reason], bot);
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
    usage: ["mkick {users}", "mkick {users} -r {reason}"]
});
