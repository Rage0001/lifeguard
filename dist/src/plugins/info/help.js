"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const calcLevel_1 = require("../../helpers/calcLevel");
const Command_1 = require("../Command");
async function mapPrefixToUsage(prefix, usage) {
    return usage.map(use => prefix + use);
}
exports.command = new Command_1.Command("help", async (msg, args, bot) => {
    try {
        const lang = bot.langs["en-US"].commands.help;
        const userLevel = await calcLevel_1.calcLevel(msg.member, msg.guild);
        const commands = bot.plugins
            .map(plugin => Array.from(plugin.commands.values()))
            .reduce((acc, val) => acc.concat(val), [])
            .filter(command => !command.options.hidden)
            .filter(command => command.options.level <= userLevel)
            .sort((a, b) => a.name.localeCompare(b.name));
        if (!args.length) {
            const embed = new discord_js_1.RichEmbed({
                description: commands
                    .map(command => `${command.name} - ${bot.langs["en-US"].commands[command.name]
                    ? bot.langs["en-US"].commands[command.name].description
                    : "No Description"}`)
                    .join("\n")
            });
            msg.channel.send(embed);
        }
        else {
            const command = commands.find(command => command.name === args[0]);
            if (command) {
                const embed = new discord_js_1.RichEmbed({
                    description: bot.langs["en-US"].commands[command.name].description,
                    fields: [
                        {
                            name: lang.options,
                            value: `${lang.guildOnly}: ${command.options.guildOnly}\n${lang.usageLevel}: ${command.options.level}`
                        },
                        {
                            name: lang.usage,
                            value: (await mapPrefixToUsage(bot.prefix, command.options.usage)).join("\n")
                        }
                    ],
                    title: command.name
                });
                if (command.options.aliases) {
                    if (embed.fields) {
                        embed.fields.push({
                            name: lang.aliases,
                            value: command.options.aliases.join("\n")
                        });
                    }
                }
                msg.channel.send(embed);
            }
        }
    }
    catch (err) {
        bot.logger.error(JSON.stringify(err));
    }
}, {
    guildOnly: true,
    hidden: false,
    level: 0,
    usage: ["help, help [name]"]
});
