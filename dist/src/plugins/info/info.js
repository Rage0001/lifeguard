"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const parseUser_1 = require("../../helpers/parseUser");
const User_1 = require("../../models/User");
const Command_1 = require("../Command");
class UnknownUser extends discord_js_1.User {
}
exports.command = new Command_1.Command("info", async (msg, args, bot) => {
    try {
        const lang = bot.langs["en-US"].commands.info;
        const embed = new discord_js_1.RichEmbed();
        let dbUser;
        let user;
        function addInfo(user) {
            if (user instanceof discord_js_1.GuildMember) {
                embed.addField("User Mention", user.user.toString());
                embed.addField("Status", lang.status[user.presence.status]);
                embed.addField("Game", user.presence.game ? user.presence.game.name : lang.notPlaying);
                embed.addField("Roles", user.roles
                    .filter(r => r.id !== msg.guild.id)
                    .map(r => r.name)
                    .join("\n"));
                embed.addField("Joined Server", user.joinedAt);
                embed.addField("Joined Discord", user.user.createdAt);
                if (dbUser) {
                    embed.addField("Infraction Count", dbUser.infractions.length);
                }
                embed.setThumbnail(user.user.displayAvatarURL);
            }
            else if (user instanceof UnknownUser) {
                embed.addField("User Mention", user.toString());
                embed.addField("Joined Discord", user.createdAt);
                embed.setThumbnail(user.displayAvatarURL);
            }
            else {
                embed.addField("User Mention", user.toString());
                embed.addField("Status", lang.status[user.presence.status]);
                embed.addField("Game", user.presence.game ? user.presence.game.name : lang.notPlaying);
                embed.addField("Joined Discord", user.createdAt);
                if (dbUser) {
                    embed.addField("Infraction Count", dbUser.infractions.length);
                }
                embed.setThumbnail(user.displayAvatarURL);
            }
        }
        if (args.length <= 0) {
            user = msg.member;
            dbUser = await User_1.findUser(user.id);
            addInfo(user);
        }
        else if (msg.guild.members.has(parseUser_1.parseUser(args[0]))) {
            user = msg.guild.members.find(u => u.id === parseUser_1.parseUser(args[0]));
            dbUser = await User_1.findUser(user.id);
            addInfo(user);
        }
        else if (bot.users.has(parseUser_1.parseUser(args[0]))) {
            user = bot.users.find(u => u.id === parseUser_1.parseUser(args[0]));
            dbUser = await User_1.findUser(user.id);
            addInfo(user);
        }
        else {
            user = (await bot.fetchUser(parseUser_1.parseUser(args[0])));
            addInfo(user);
        }
        embed.setTimestamp();
        msg.channel.send(embed);
    }
    catch (err) {
        bot.logger.error(err);
    }
}, {
    guildOnly: true,
    hidden: false,
    level: 0,
    usage: ["ping"]
});
