"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../Command");
exports.command = new Command_1.Command("add", async (msg, args, bot) => {
    try {
        msg.channel.send("Hi from the subcomman system");
        const lang = bot.langs["en-US"].commands.role;
        const member = msg.mentions.members.first() || msg.guild.members.get(args[1]);
        const roleID = args[2];
        const role = msg.guild.roles.get(roleID);
        if (!role) {
            return msg.channel.send(lang.errors.notValidRole);
        }
        if (!member) {
            return msg.channel.send(lang.errors.notValidRole);
        }
        member.addRole(role);
        msg.channel.send(bot.format(lang.addedRole, {
            role: role.name,
            user: member.user.tag
        }));
    }
    catch (err) {
        bot.logger.error(JSON.stringify(err));
    }
}, {
    guildOnly: true,
    hidden: false,
    level: 2,
    usage: [
        "role add {user} {role_id}",
        "role remove {user} {role_id}",
        "role list {role_name}"
    ]
});
