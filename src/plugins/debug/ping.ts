import {Command} from '@plugins/Command';
import {MessageEmbed} from 'discord.js';
import {defaultEmbed} from '@util/DefaultEmbed';

export const command = new Command<string[]>(
  'ping',
  async (lifeguard, msg) => {
    const m = await msg.channel.send('Ping?');
    m.delete({timeout: 100});

    const embed: MessageEmbed = defaultEmbed()
      .setTitle('Pong! :ping_pong:')
      .addFields([
        {
          name: 'Bot Latency',
          value: `${Math.round(lifeguard.ws.ping)}ms`,
        },
        {
          name: 'Message Latency',
          value: `${m.createdTimestamp - msg.createdTimestamp}ms`,
        },
      ])
      .setFooter(
        `Executed By ${msg.author.tag}`,
        msg.author.avatarURL() ?? msg.author.defaultAvatarURL
      );

    msg.channel.send(embed);
  },
  {
    level: 0,
    usage: ['ping'],
  }
);
