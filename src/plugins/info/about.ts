import { Command } from '../Command';
import { promisify } from 'util';
import { exec } from 'child_process';
import { resolve } from 'path';
import { MessageEmbed } from 'discord.js';

export const command = new Command(
  'about',
  async (lifeguard, msg, args) => {
    // Convert child_process#exec to async/await
    const run = promisify(exec);

    // Get Git Commit ID
    const { stdout: gitCommitID } = await run('git rev-parse HEAD', {
      cwd: resolve(__dirname),
    });
    const gitCommitURL = `https://gitdab.com/lifeguard/bot/commit/${gitCommitID}`;

    // Get Node Version
    const { stdout: nodeVersion } = await run('node -v');

    // Get Discord.js Version
    const { version: discordjsVersion } = require('discord.js/package.json');

    // Get Lifeguard Version
    const { version: lifeguardVersion } = require('../../../../package.json');

    const embed = new MessageEmbed()
      .setTitle('About Lifeguard')
      .addField(
        'Git Commit',
        `[${gitCommitID}](${gitCommitURL}) (https://gitdab.com/lifeguard/bot/)`
      )
      .addField('Node Version', nodeVersion)
      .addField('Discord.js Version', discordjsVersion)
      .addField('Lifeguard Version', lifeguardVersion)
      .setColor(0x7289da)
      .setFooter(
        `Executed By ${msg.author.tag}`,
        msg.author.avatarURL() ?? msg.author.defaultAvatarURL
      )
      .setTimestamp();
    msg.channel.send(embed);
  },
  {
    level: 0,
    usage: ['about'],
  }
);
