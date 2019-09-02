"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ms = require("ms");
const Command_1 = require("../Command");
exports.command = new Command_1.Command("slowmode", async (msg, args, bot) => {
    const lang = bot.langs["en-US"].commands.slowmode;
    switch (args[0].toLowerCase()) {
        case "here":
            const hereTime = ms(args[1]);
            if (!hereTime) {
                return msg.channel.send(lang.errors.notValidTime);
            }
            const hereSeconds = hereTime / 1000;
            msg.channel.setRateLimitPerUser(hereSeconds);
            msg.channel.send(bot.format(lang.setSlowmode, {
                time: args[1]
            }));
            break;
        case "channel":
            const channelTime = ms(args[2]);
            if (!channelTime) {
                return msg.channel.send(lang.errors.notValidTime);
            }
            const channelSeconds = channelTime / 1000;
            const channel = msg.mentions.channels.first() || msg.guild.channels.get(args[1]);
            if (!channel) {
                return msg.channel.send(bot.langs["en-US"].commands.announce.errors.notValidChannel);
            }
            if (channel.guild.id !== msg.guild.id) {
                return msg.channel.send(bot.langs["en-US"].commands.announce.errors.notValidChannel);
            }
            if (channel.type === "voice") {
                return msg.channel.send(lang.onlyTextChannel);
            }
            channel.setRateLimitPerUser(channelSeconds);
            msg.channel.send(bot.format(lang.setSlowmodeInChannel, {
                channel: channel.name,
                time: args[2]
            }));
            break;
        default:
            msg.channel.send(lang.errors.notValidArgument);
            break;
    }
}, {
    guildOnly: true,
    hidden: false,
    level: 3,
    usage: ["slowmode channel {channel} {time}", "slowmode here {time}"]
});
