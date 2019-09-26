"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const parseUser_1 = require("../../helpers/parseUser");
const User_1 = require("../../models/User");
const Command_1 = require("../Command");
exports.command = new Command_1.Command("ban", async (msg, args, bot) => {
    try {
        const lang = bot.langs["en-US"].commands.ban;
        const userID = parseUser_1.parseUser(args[0]);
        const user = await User_1.findUser(userID);
        const banMember = msg.guild.members.get(userID);
        if (banMember) {
            if (banMember.bannable) {
                const u = bot.users.get(userID);
                const reason = args.slice(1).join(" ");
                if (user) {
                    const infs = user.get("infractions");
                    infs.push({
                        action: "Ban",
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
                }
                else {
                    const embed = new discord_js_1.RichEmbed({
                        description: lang.errors.noUser
                    });
                    msg.channel.send(embed);
                }
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
                    bot.addEvent({
                        args: [u.id, msg.author.id, reason, msg.guild.id],
                        event: "guildBanAdd"
                    });
                    banMember.ban({ reason });
                    const responseEmbed = new discord_js_1.RichEmbed({
                        description: bot.format(lang.inf.responseDesc, {
                            reason,
                            user: `${u.username}#${u.discriminator} (${u.id})`
                        })
                    });
                    msg.channel.send(responseEmbed);
                }
            }
            else {
                const errorEmbed = new discord_js_1.RichEmbed({
                    description: lang.errors.notBannable
                });
                return msg.channel.send(errorEmbed);
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
    usage: ["ban {user} [reason]"]
});
