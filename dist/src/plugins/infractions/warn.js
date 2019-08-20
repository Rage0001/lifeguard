"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Guild_1 = require("../../models/Guild");
const User_1 = require("../../models/User");
const Command_1 = require("../Command");
exports.command = new Command_1.Command("warn", async (msg, args, bot) => {
    const lang = bot.langs["en-US"].commands.warn;
    const user = await User_1.findUser(args[0]);
    if (user) {
        const infs = user.get("infractions");
        infs.push({
            action: "Warning",
            active: true,
            guild: msg.guild.id,
            id: infs.length + 1,
            moderator: msg.author.id,
            reason: args.slice(1).join(" "),
            time: Date.now()
        });
        user.set("infractions", infs);
        user.markModified("infractions");
        user.save();
        const embed = new discord_js_1.RichEmbed({
            description: bot.format(lang.inf.desc, {
                guild: msg.guild.name,
                reason: args.slice(1).join(" ")
            }),
            title: lang.inf.title
        });
        const u = bot.users.get(user.id);
        if (u) {
            u.send(embed);
            const guild = await Guild_1.findGuild(msg.guild.id);
            if (guild) {
                if (guild.modLog) {
                    const modLog = msg.guild.channels.get(guild.modLog);
                    if (modLog) {
                        const embed2 = new discord_js_1.RichEmbed({
                            description: bot.format(lang.inf.modLog, {
                                mod: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
                                reason: args.slice(1).join(" "),
                                user: `${u.username}#${u.discriminator} (${u.id})`
                            })
                        });
                        modLog.send(embed2);
                    }
                }
            }
        }
    }
    else {
        const embed = new discord_js_1.RichEmbed({
            description: lang.errors.noUser
        });
        msg.channel.send(embed);
    }
}, {
    guildOnly: true,
    hidden: false,
    level: 2,
    usage: ["warn {user} [reason]"]
});
