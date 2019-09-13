"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const discord_js_1 = require("discord.js");
const path_1 = require("path");
const util_1 = require("util");
const Command_1 = require("../Command");
exports.command = new Command_1.Command("update", async (msg, args, bot) => {
    const lang = bot.langs["en-US"].commands.update;
    const defaultLang = bot.langs.default;
    const run = util_1.promisify(child_process_1.exec);
    const pull = await run("git pull", { cwd: path_1.resolve(__dirname) });
    if (pull.stdout !== defaultLang["git:noupdate"]) {
        const { stdout: commitID } = await run("git rev-parse HEAD", { cwd: path_1.resolve(__dirname) });
        const commitLink = `https://github.com/Rage0001/lifeguard/commit/${commitID}`;
        // msg.channel.send(`Updated to __\`${commitID.substring(0, 7)}\`__\n${commitLink}`);
        const embed = new discord_js_1.RichEmbed({
            description: bot.format(lang.success, {
                commitID: `[${commitID}](${commitLink})`
            }),
            title: lang.title
        });
        embed.setTimestamp();
        msg.channel.send(embed);
        if (args[0] === "-r") {
            const plugin = bot.plugins.find((plugin) => plugin.commands.has("restart"));
            if (plugin) {
                const restart = plugin.commands.get("restart");
                if (restart) {
                    restart.func(msg, [], bot);
                }
            }
        }
    }
    else {
        msg.channel.send(defaultLang["git:noupdate"]);
    }
    if (pull.stderr) {
        bot.logger.error(pull.stderr);
    }
}, {
    guildOnly: true,
    hidden: true,
    level: 5,
    usage: ["update", "update -r"]
});
