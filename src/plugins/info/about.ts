import { Command } from "@plugins/Command";
import { exec } from "child_process";
import { MessageEmbed } from "discord.js";
import { platform, release, type } from "os";
import { resolve } from "path";
import { promisify } from "util";
import { defaultEmbed } from "@lifeguard/util/DefaultEmbed";

export const command: Command = new Command(
  "about",
  async (lifeguard, msg, args) => {
    // Convert child_process#exec to async/await
    const run = promisify(exec);

    // Get Git Commit ID
    const { stdout: gitCommitID } = await run("git rev-parse HEAD", {
      cwd: resolve(__dirname)
    });
    const gitCommitURL =
      `https://github.com/lifeguardbot/lifeguard/commit/${gitCommitID}`;

    // Get Node Version
    const { stdout: nodeVersion } = await run("node -v");

    // Get Discord.js Version
    const { version: discordjsVersion } = require("discord.js/package.json");

    // Get Lifeguard Version
    const {
      version: lifeguardVersion
    } = require("@lifeguard/base/package.json");

    const { heapUsed, heapTotal } = process.memoryUsage();

    const embed: MessageEmbed = defaultEmbed()
      .setTitle("About Lifeguard")
      .addFields([
        {
          name: "Git Commit",
          value:
            `[${gitCommitID}](${gitCommitURL}) (https://github.com/lifeguardbot/lifeguard/)`
        },
        {
          name: "Node Version",
          value: nodeVersion
        },
        {
          name: "Discord.js Version",
          value: discordjsVersion
        },
        {
          name: "Lifeguard Version",
          value: lifeguardVersion
        },
        {
          name: "System OS",
          value: `${type()} ${release()} (${platform()})`,
          inline: true
        },
        {
          name: "System Memory Usage",
          value: `${Math.round((heapUsed / heapTotal) * 100)}%`,
          inline: true
        }
      ])
      .setFooter(
        `Executed By ${msg.author.tag}`,
        msg.author.avatarURL() ?? msg.author.defaultAvatarURL
      );
    await msg.channel.send(embed);
  },
  {
    level: 0,
    usage: ["about"]
  }
);
