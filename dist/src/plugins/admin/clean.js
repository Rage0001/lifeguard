"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Guild_1 = require("../../models/Guild");
const Command_1 = require("../Command");
exports.command = new Command_1.Command("clean", async (msg, args, bot) => {
    try {
        const lang = bot.langs["en-US"].commands.clean;
        const defaultCount = 25;
        switch (args[0].toLowerCase()) {
            case "all":
                let allParsedArgument = parseInt(args[1], 10);
                if (isNaN(allParsedArgument)) {
                    return msg.channel.send(lang.errors.NAN);
                }
                if (!allParsedArgument) {
                    allParsedArgument = defaultCount;
                }
                msg.channel.startTyping();
                msg.channel.bulkDelete(allParsedArgument + 1);
                msg.channel.stopTyping();
                await msg.channel.send(bot.format(lang.cleanedAll.message, {
                    amount: String(allParsedArgument)
                }));
                const guild = await Guild_1.findGuild(msg.guild.id);
                if (guild) {
                    if (guild.modLog) {
                        const modLog = msg.guild.channels.get(guild.modLog);
                        if (modLog) {
                            const embed = new discord_js_1.RichEmbed({
                                description: bot.format(lang.cleanedAll.modLog, {
                                    amount: String(allParsedArgument),
                                    channel: msg.channel.toString(),
                                    channelID: msg.channel.id,
                                    mod: msg.author.tag,
                                    modID: msg.author.id
                                })
                            });
                            modLog.send(embed);
                        }
                    }
                }
                break;
            case "user":
                async function userDel(amount, userId, message) {
                    let messagesDeleted = 0;
                    const deleteAmount = amount;
                    const count = 100;
                    let lastId = null;
                    let fetchedOverall = 0;
                    const stop = 500;
                    do {
                        const options = lastId == null
                            ? { limit: count }
                            : { limit: count, before: lastId };
                        const fetched = await message.channel.fetchMessages(options);
                        if (fetched.size > 0) {
                            lastId = fetched.last().id;
                        }
                        fetchedOverall += fetched.size;
                        let filtered = fetched.filter(x => x.author.id === userId);
                        if (messagesDeleted + filtered.size > deleteAmount) {
                            filtered = Array.from(filtered.keys()).slice(0, deleteAmount - messagesDeleted);
                        }
                        messagesDeleted += await message.channel.bulkDelete(filtered);
                    } while (messagesDeleted < deleteAmount &&
                        (await message.channel.fetchMessages(lastId == null
                            ? { limit: count }
                            : { limit: count, before: lastId })).size === count &&
                        fetchedOverall < stop);
                }
                const user = msg.mentions.members.first() || msg.guild.members.get(args[1]);
                if (!user) {
                    return msg.channel.send(lang.errors.invalidUser);
                }
                let userParsedArgument = parseInt(args[2], 10);
                if (isNaN(userParsedArgument)) {
                    return msg.channel.send(lang.errors.NAN);
                }
                if (!userParsedArgument) {
                    userParsedArgument = defaultCount;
                }
                msg.channel.startTyping();
                userDel(userParsedArgument + 1, user.id, msg);
                msg.channel.stopTyping();
                await msg.channel.send(bot.format(lang.cleanedUser.message, {
                    amount: String(userParsedArgument),
                    tag: user.user.tag
                }));
                break;
            case "until":
                const msgToCleanUntil = args[1];
                const channelMessages = await msg.channel.fetchMessages();
                break;
            default:
                msg.channel.send(lang.errors.nonValidArgument);
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
    usage: [
        "clean all {amount}",
        "clean user {user} {amount}",
        "clean bots {amount}",
        "clean until {messageid}",
        "clean between {messageid} {messageid}"
    ]
});
