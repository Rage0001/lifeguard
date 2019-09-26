"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const parseUser_1 = require("../../helpers/parseUser");
const Command_1 = require("../Command");
exports.command = new Command_1.Command("unban", async (msg, args, bot) => {
    try {
        const lang = bot.langs["en-US"].commands.unban;
        const userID = parseUser_1.parseUser(args[0]);
        const reason = args.slice(1).join(" ");
        bot.addEvent({
            args: [userID, msg.author.id, reason, msg.guild.id],
            event: "guildBanRemove"
        });
        const u = await msg.guild.unban(userID);
        const responseEmbed = new discord_js_1.RichEmbed({
            description: bot.format(lang.inf.responseDesc, {
                reason,
                user: `${u.username}#${u.discriminator} (${u.id})`
            })
        });
        msg.channel.send(responseEmbed);
    }
    catch (err) {
        bot.logger.error(JSON.stringify(err));
    }
}, {
    guildOnly: true,
    hidden: false,
    level: 2,
    usage: ["unban {user} [reason]"]
});
