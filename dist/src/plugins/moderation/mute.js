"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const parseUser_1 = require("../../helpers/parseUser");
const Guild_1 = require("../../models/Guild");
const User_1 = require("../../models/User");
const Command_1 = require("../Command");
exports.command = new Command_1.Command("mute", async (msg, args, bot) => {
    try {
        const lang = bot.langs["en-US"].commands.mute;
        const userID = parseUser_1.parseUser(args[0]);
        const user = await User_1.findUser(userID);
        if (user) {
            const muteMember = msg.guild.members.get(userID);
            if (muteMember) {
                const u = bot.users.get(user.id);
                const reason = args.slice(1).join(" ");
                const infs = user.get("infractions");
                infs.push({
                    action: "Mute",
                    active: true,
                    guild: msg.guild.id,
                    id: infs.length + 1,
                    moderator: msg.author.id,
                    reason,
                    time: Date.now()
                });
                user.set("infractions", infs);
                user.markModified("infractions");
                user.save();
                const embed = new discord_js_1.RichEmbed({
                    description: bot.format(lang.inf.desc, {
                        guild: msg.guild.name,
                        reason
                    }),
                    title: lang.inf.title
                });
                embed.setTimestamp();
                if (u) {
                    await u.send(embed);
                    const responseEmbed = new discord_js_1.RichEmbed({
                        description: bot.format(lang.inf.responseDesc, {
                            reason,
                            user: `${u.username}#${u.discriminator} (${u.id})`
                        })
                    });
                    msg.channel.send(responseEmbed);
                    const guild = await Guild_1.findGuild(msg.guild.id);
                    if (guild) {
                        const muteRole = msg.guild.roles.get(guild.muteRole);
                        if (muteRole) {
                            muteMember.addRole(muteRole);
                        }
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
            }
        }
        else {
            const embed = new discord_js_1.RichEmbed({
                description: lang.errors.noUser,
            });
            msg.channel.send(embed);
        }
    }
    catch (err) {
        bot.logger.error(JSON.stringify(err));
    }
}, {
    guildOnly: true,
    hidden: false,
    level: 2,
    usage: ["mute {user} {reason}"]
});