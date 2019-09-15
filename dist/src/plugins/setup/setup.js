"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Guild_1 = require("../../models/Guild");
const Command_1 = require("../Command");
exports.command = new Command_1.Command("setup", async (msg, args, bot) => {
    try {
        const lang = bot.langs["en-US"].commands.setup;
        const m = await msg.channel.send(new discord_js_1.RichEmbed({
            description: bot.format(lang.collector.start, {
                user: msg.author.tag
            })
        }));
        if (!Array.isArray(m)) {
            m.delete(10000);
        }
        const collector = new discord_js_1.MessageCollector(msg.channel, (m) => {
            return m.author.id === msg.author.id;
        });
        const guildData = { id: msg.guild.id, locale: "en-US", prefix: bot.prefix };
        const msgs = [];
        const help = await msg.channel.send(new discord_js_1.RichEmbed({
            description: lang.collector.help
        }));
        if (!Array.isArray(help)) {
            msgs.push(help);
        }
        collector.once("end", async (coll) => {
            Array.from(coll.values()).map(msg => msg.delete(1000));
            msgs.map(msg => msg.delete(2000));
            console.log(guildData);
            const guild = await Guild_1.findGuild(msg.guild.id);
            if (guild) {
                Object.keys(guildData).map((k) => {
                    guild.set(k, guildData[k]);
                    guild.markModified(k);
                });
                await guild.save();
            }
            const m = await msg.channel.send(new discord_js_1.RichEmbed({
                description: lang.collector.end
            }));
            if (!Array.isArray(m)) {
                m.delete(3000);
            }
        });
        collector.on("collect", async (m, coll) => {
            const split = m.content.split(" ");
            const name = split[0];
            split.shift();
            const args = split;
            let botMsg;
            switch (name) {
                case "help":
                    botMsg = await msg.channel.send(new discord_js_1.RichEmbed({
                        description: lang.collector.help
                    }));
                    if (!Array.isArray(botMsg)) {
                        msgs.push(botMsg);
                    }
                    break;
                case "locale":
                    guildData.locale = args[0];
                    botMsg = await msg.channel.send(new discord_js_1.RichEmbed({
                        description: bot.format(lang.collector.localeCollected, {
                            locale: guildData.locale
                        })
                    }));
                    if (!Array.isArray(botMsg)) {
                        msgs.push(botMsg);
                    }
                    break;
                case "modLog":
                    guildData.modLog = args[0];
                    botMsg = await msg.channel.send(new discord_js_1.RichEmbed({
                        description: bot.format(lang.collector.modLogCollected, {
                            modLog: guildData.modLog
                        })
                    }));
                    if (!Array.isArray(botMsg)) {
                        msgs.push(botMsg);
                    }
                    break;
                case "modRole":
                    guildData.modRole = args[0];
                    botMsg = await msg.channel.send(new discord_js_1.RichEmbed({
                        description: bot.format(lang.collector.modRoleCollected, {
                            modRole: guildData.modRole
                        })
                    }));
                    if (!Array.isArray(botMsg)) {
                        msgs.push(botMsg);
                    }
                    break;
                case "prefix":
                    guildData.prefix = args[0];
                    botMsg = await msg.channel.send(new discord_js_1.RichEmbed({
                        description: bot.format(lang.collector.prefixCollected, {
                            prefix: guildData.prefix
                        })
                    }));
                    if (!Array.isArray(botMsg)) {
                        msgs.push(botMsg);
                    }
                    break;
                case "muteRole":
                    guildData.muteRole = args[0];
                    botMsg = await msg.channel.send(new discord_js_1.RichEmbed({
                        description: bot.format(lang.collector.muteRoleCollected, {
                            muteRole: guildData.muteRole
                        })
                    }));
                    if (!Array.isArray(botMsg)) {
                        msgs.push(botMsg);
                    }
                    break;
                case "end":
                    coll.stop();
                    break;
                default:
                    botMsg = await msg.channel.send(new discord_js_1.RichEmbed({
                        description: lang.collector.help
                    }));
                    if (!Array.isArray(botMsg)) {
                        msgs.push(botMsg);
                    }
                    break;
            }
        });
    }
    catch (err) {
        bot.logger.error(JSON.stringify(err));
    }
}, {
    guildOnly: true,
    hidden: false,
    level: 0,
    usage: ["setup"]
});
