"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const parseUser_1 = require("../../helpers/parseUser");
const Guild_1 = require("../../models/Guild");
const Command_1 = require("../Command");
exports.command = new Command_1.Command("unban", async (msg, args, bot) => {
    try {
        const lang = bot.langs["en-US"].commands.unban;
        const userID = parseUser_1.parseUser(args[0]);
        const u = await msg.guild.unban(userID);
        const reason = args.slice(1).join(" ");
        const responseEmbed = new discord_js_1.RichEmbed({
            description: bot.format(lang.inf.responseDesc, {
                reason,
                user: `${u.username}#${u.discriminator} (${u.id})`
            })
        });
        msg.channel.send(responseEmbed);
        const guild = await Guild_1.findGuild(msg.guild.id);
        if (guild) {
            if (guild.modLog) {
                const modLog = msg.guild.channels.get(guild.modLog);
                if (modLog) {
                    const embed2 = new discord_js_1.RichEmbed({
                        description: bot.format(lang.inf.modLog, {
                            mod: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
                            reason,
                            user: `${u.username}#${u.discriminator} (${u.id})`
                        })
                    });
                    modLog.send(embed2);
                }
            }
        }
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
