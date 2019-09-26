import { exec } from "child_process";
import { RichEmbed } from "discord.js";
import { resolve } from "path";
import { promisify } from "util";
import { Command } from "../Command";

export const command = new Command(
  "update",
  async (msg, args, bot) => {
    try {
      const lang = bot.langs["en-US"].commands.update;
      const defaultLang = bot.langs.default;
      const run = promisify(exec);

      const pull = await run("git pull", { cwd: resolve(__dirname) });
      if (pull.stdout !== defaultLang["git:noupdate"]) {
        const { stdout: commitID } = await run("git rev-parse HEAD", {
          cwd: resolve(__dirname)
        });
        const commitLink = `https://github.com/lifeguardbot/lifeguard/commit/${commitID}`;

        const embed = new RichEmbed({
          description: bot.format(lang.success, {
            commitID: `[${commitID.substr(0, 7)}](${commitLink})`
          }),
          title: lang.title
        });
        embed.setTimestamp();
        msg.channel.send(embed);

        if (args[0] === "-r") {
          const plugin = bot.plugins.find(plugin =>
            plugin.commands.has("restart")
          );
          if (plugin) {
            const restart = plugin.commands.get("restart");
            if (restart) {
              restart.func(msg, [], bot);
            }
          }
        }
      } else {
        msg.channel.send(
          new RichEmbed({
            description: defaultLang["git:noupdate"]
          })
        );
      }

      if (pull.stderr) {
        bot.logger.error(pull.stderr);
      }
    } catch (err) {
      bot.logger.error(JSON.stringify(err));
    }
  },
  {
    guildOnly: true,
    hidden: true,
    level: 5,
    usage: ["update", "update -r"]
  }
);
