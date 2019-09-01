"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("../Command");
exports.command = new Command_1.Command("announce", async (msg, args, bot) => {
    const lang = bot.langs["en-US"].commands.announce;
    const channel = msg.mentions.channels.first();
    if (channel.guild.id !== msg.guild.id) {
        return msg.channel.send(lang.notValidChannel);
    }
    if (!channel) {
        return msg.channel.send(lang.notValidChannel);
    }
    const channelPermissions = msg.guild.me.permissionsIn(channel);
    if (!channelPermissions.has("VIEW_CHANNEL") || !channelPermissions.has("SEND_MESSAGES")) {
        msg.channel.send(lang.noPermissions);
    }
    const announceMessage = args.slice(1).join(" ");
    const embed = new discord_js_1.RichEmbed();
    embed.setDescription(announceMessage);
    const confirmationMsg = await msg.channel.send(lang.confirmation, embed);
    const yesReaction = await confirmationMsg.react("✅");
    const noReaction = await confirmationMsg.react("❌");
    const filter = (reaction, user) => user.id === msg.author.id;
    const messageCollector = confirmationMsg.createReactionCollector(filter, { time: 15000 });
    messageCollector.on("collect", r => {
        switch (r.emoji.name) {
            case "✅":
                const yesUserReaction = r.message.reactions.filter(r => r.emoji.name === "✅");
                yesUserReaction.first().remove(msg.author);
                channel.send(announceMessage);
                confirmationMsg.edit(lang.announced, { embed: {} });
                messageCollector.stop();
                break;
            case "❌":
                const noUserReaction = r.message.reactions.filter(r => r.emoji.name === "❌");
                noUserReaction.first().remove(msg.author);
                confirmationMsg.edit(lang.abort, { embed: {} });
                messageCollector.stop();
                break;
            default:
                break;
        }
    });
    messageCollector.on("end", c => {
        yesReaction.remove(bot.user);
        noReaction.remove(bot.user);
    });
}, {
    guildOnly: true,
    hidden: false,
    level: 3,
    usage: ["announce {channel} {message}"]
});
