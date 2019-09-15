"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../Command");
exports.command = new Command_1.Command("role", async (msg, args, bot) => {
    const lang = bot.langs["en-US"].commands.role;
    const member = msg.mentions.members.first() || msg.guild.members.get(args[1]);
    const roleID = args[2];
    const role = msg.guild.roles.get(roleID);
    switch (args[0].toLowerCase()) {
        case "add":
            if (!role) {
                msg.channel.send(lang.notValidRole);
            }
            if (!member) {
                msg.channel.send(lang.notValidRole);
            }
            member.addRole(role);
            msg.channel.send(bot.format(lang.addedRole, {
                role: role.name,
                user: member.user.tag
            }));
            break;
        case "remove":
            if (!role) {
                return msg.channel.send(lang.notValidRole);
            }
            if (!member) {
                return msg.channel.send(lang.notValidRole);
            }
            member.removeRole(role);
            msg.channel.send(bot.format(lang.removedRole, {
                role: role.name,
                user: member.user.tag
            }));
            break;
        case "list":
            const similarRole = msg.guild.roles.find(r => r.name === args.slice(1).join(" "));
            if (!similarRole) {
                return msg.channel.send(lang.notValidRoleName);
            }
            msg.channel.send(`${bot.format(lang.members, {
                role: similarRole.name
            })}\`\`\`${similarRole.members.map(m => `${m.user.tag} - ${m.user.id}`).join("\n")}\`\`\``);
            break;
        default:
            break;
    }
}, {
    guildOnly: true,
    hidden: false,
    level: 2,
    usage: ["role add {user} {role_id}", "role remove {user} {role_id}", "role list {role_name}"]
});
