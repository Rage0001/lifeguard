"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const parseUser_1 = require("../../helpers/parseUser");
const Command_1 = require("../Command");
exports.command = new Command_1.Command("forceban", async (msg, args, bot) => {
    try {
        const lang = bot.langs["en-US"].commands.forceban;
        const userID = parseUser_1.parseUser(args[0]);
        const u = await bot.fetchUser(userID);
        if (u) {
            const reason = args.slice(1).join(" ");
            bot.addEvent({
                args: [u.id, msg.author.id, reason, msg.guild.id],
                event: "guildBanAdd"
            });
            await msg.guild.ban(userID, { reason });
            const responseEmbed = new discord_js_1.RichEmbed({
                description: bot.format(lang.inf.responseDesc, {
                    reason,
                    user: `${u.username}#${u.discriminator} (${u.id})`
                })
            });
            msg.channel.send(responseEmbed);
        }
    }
    catch (err) {
        bot.logger.error(JSON.stringify(err));
    }
}, {
    guildOnly: true,
    hidden: false,
    level: 2,
    usage: ["ban {user} [reason]"]
});
