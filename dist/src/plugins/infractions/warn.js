"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../Command");
exports.command = new Command_1.Command("warn", async (msg, args, bot) => {
    const lang = bot.langs["en-US"].commands.warn;
    // const infraction = new Infraction({
    //   action: "Warning",
    //   active: true,
    //   guild: msg.guild.id,
    //   moderator: msg.author.id,
    //   reason: args.slice(1).join(" "),
    //   time: Date.now(),
    //   uid: args[0]
    // });
}, {
    guildOnly: true,
    hidden: false,
    level: 2,
    usage: ["warn [user] [reason]"]
});
