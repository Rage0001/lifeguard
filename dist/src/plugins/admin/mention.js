"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../Command");
exports.command = new Command_1.Command("mention", async (msg, args, bot) => {
    try {
        const lang = bot.langs["en-US"].commands.mention;
        const roleID = args[1];
        const role = msg.guild.roles.get(roleID);
        if (!role) {
            return msg.channel.send(lang.errors.notValidRole);
        }
        switch (args[0].toLowerCase()) {
            case "enable":
                role.setMentionable(true);
                msg.channel.send(bot.format(lang.enabled, {
                    role: role.name
                }));
                break;
            case "disable":
                role.setMentionable(false);
                msg.channel.send(bot.format(lang.disabled, {
                    role: role.name
                }));
                break;
            default:
                break;
        }
    }
    catch (err) {
        bot.logger.error(JSON.stringify(err));
    }
}, {
    guildOnly: true,
    hidden: false,
    level: 2,
    usage: ["mention enable {role_id}", "mention disable {role_id}"]
});
