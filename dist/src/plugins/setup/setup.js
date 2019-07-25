"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("../Command");
exports.command = new Command_1.Command("setup", async (msg, args, bot) => {
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
    const guildData = { id: msg.guild.id, prefix: bot.prefix };
    const msgs = [];
    collector.once("end", async (coll) => {
        Array.from(coll.values()).map(msg => msg.delete(1000));
        msgs.map(msg => msg.delete(1000));
        console.log(guildData);
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
}, {
    guildOnly: true,
    hidden: false,
    level: 0,
    usage: ["setup"]
});