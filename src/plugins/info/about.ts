import { Command } from '@plugins/Command';
import { exec } from 'child_process';
import { MessageEmbed } from 'discord.js';
import { platform, release, type } from 'os';
import { resolve } from 'path';
import { promisify } from 'util';

export const command = new Command(
  'about',
  async (lifeguard, msg, args) => {
    // Convert child_process#exec to async/await
    const run = promisify(exec);

    // Get Git Commit ID
    const { stdout: gitCommitID } = await run('git rev-parse HEAD', {
      cwd: resolve(__dirname),
    });
    const gitCommitURL = `https://github.com/lifeguardbot/lifeguard/commit/${gitCommitID}`;

    // Get Node Version
    const { stdout: nodeVersion } = await run('node -v');

    // Get Discord.js Version
    const { version: discordjsVersion } = require('discord.js/package.json');

    // Get Lifeguard Version
    const {
      version: lifeguardVersion,
    } = require('@lifeguard/base/package.json');

    const { heapUsed, heapTotal } = process.memoryUsage();

    const embed = new MessageEmbed()
      .setTitle('About Lifeguard')
      .addField(
        'Git Commit',
        `[${gitCommitID}](${gitCommitURL}) (https://github.com/lifeguardbot/lifeguard/)`
      )
      .addField('Node Version', nodeVersion)
      .addField('Discord.js Version', discordjsVersion)
      .addField('Lifeguard Version', lifeguardVersion)
      .addField('System OS', `${type()} ${release()} (${platform()})`, true)
      .addField(
        'System Memory Usage',
        `${Math.round((heapUsed / heapTotal) * 100)}%`,
        true
      )
      .setColor(0x7289da)
      .setFooter(
        `Executed By ${msg.author.tag}`,
        msg.author.avatarURL() ?? msg.author.defaultAvatarURL
      )
      .setTimestamp();
    await msg.channel.send(embed);
  },
  {
    level: 0,
    usage: ['about'],
  }
);
