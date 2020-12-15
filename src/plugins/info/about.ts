import {platform, release, type} from 'os';

import {Command} from '@plugins/Command';
import {MessageEmbed} from 'discord.js';
import {defaultEmbed} from '@lifeguard/util/DefaultEmbed';
import {exec} from 'child_process';
import {promisify} from 'util';
import {resolve} from 'path';

export const command = new Command<string[]>(
  'about',
  async (_lifeguard, msg) => {
    // Convert child_process#exec to async/await
    const run = promisify(exec);

    // Get Git Commit ID
    const {stdout: gitCommitID} = await run('git rev-parse HEAD', {
      cwd: resolve(__dirname),
    });
    const gitCommitURL = `https://github.com/lifeguardbot/lifeguard/commit/${gitCommitID}`;

    // Get Node Version
    const {stdout: nodeVersion} = await run('node -v');

    // Get Discord.js Version
    const {version: discordjsVersion} = await import('discord.js/package.json');

    // Get Lifeguard Version
    const {version: lifeguardVersion} = await import('@base/package.json');

    const {heapUsed, heapTotal} = process.memoryUsage();

    const embed: MessageEmbed = defaultEmbed()
      .setTitle('About Lifeguard')
      .addFields([
        {
          name: 'Git Commit',
          value: `[${gitCommitID}](${gitCommitURL}) (https://github.com/lifeguardbot/lifeguard/)`,
        },
        {
          name: 'Node Version',
          value: nodeVersion,
        },
        {
          name: 'Discord.js Version',
          value: discordjsVersion,
        },
        {
          name: 'Lifeguard Version',
          value: lifeguardVersion,
        },
        {
          name: 'System OS',
          value: `${type()} ${release()} (${platform()})`,
          inline: true,
        },
        {
          name: 'System Memory Usage',
          value: `${Math.round((heapUsed / heapTotal) * 100)}%`,
          inline: true,
        },
      ])
      .setFooter(
        `Executed By ${msg.author.tag}`,
        msg.author.avatarURL() ?? msg.author.defaultAvatarURL
      );
    await msg.channel.send(embed);
  },
  {
    level: 0,
    usage: ['about'],
  }
);
