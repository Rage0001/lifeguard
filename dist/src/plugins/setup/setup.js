"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("../Command");
exports.command = new Command_1.Command("setup", async (msg, args, bot) => {
    const lang = bot.langs["en-US"].commands.setup;
    await msg.channel.send(new discord_js_1.RichEmbed({
        description: bot.format(lang.collector.start, {
            user: msg.author.tag
        })
    }));
    const collector = new discord_js_1.MessageCollector(msg.channel, (m) => {
        return m.author.id === msg.author.id;
    });
    const guildData = { id: msg.guild.id };
    collector.once("end", (coll, reason) => {
        console.log(Array.from(coll.values()).map(msg => msg.content));
        console.log(guildData);
        msg.channel.send(new discord_js_1.RichEmbed({
            description: lang.collector.end
        }));
    });
    collector.on("collect", (m, coll) => {
        const split = m.content.split(" ");
        const name = split[0];
        split.shift();
        const args = split;
        switch (name) {
            case "help":
                msg.channel.send(new discord_js_1.RichEmbed({
                    description: lang.collector.help
                }));
                break;
            case "locale":
                guildData.locale = args[0];
                msg.channel.send(new discord_js_1.RichEmbed({
                    description: bot.format(lang.collector.localeCollected, {
                        locale: guildData.locale
                    })
                }));
                break;
            case "modRole":
                guildData.modRole = args[0];
                msg.channel.send(new discord_js_1.RichEmbed({
                    description: bot.format(lang.collector.modRoleCollected, {
                        modRole: guildData.modRole
                    })
                }));
                break;
            case "prefix":
                guildData.prefix = args[0];
                msg.channel.send(new discord_js_1.RichEmbed({
                    description: bot.format(lang.collector.prefixCollected, {
                        prefix: guildData.prefix
                    })
                }));
                break;
            case "end":
                coll.stop();
                break;
            default:
                msg.channel.send(new discord_js_1.RichEmbed({
                    description: lang.collector.help
                }));
                break;
        }
    });
}, {
    guildOnly: true,
    hidden: false,
    level: 0,
    usage: ["setup"]
});
