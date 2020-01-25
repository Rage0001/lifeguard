import { Command } from '../Command';
import { defaultEmbed } from '../../util/DefaultEmbed';

export const command = new Command(
  'ping',
  async (lifeguard, msg, args) => {
    const m = await msg.channel.send('Ping?');
    m.delete({ timeout: 100 });

    const embed = defaultEmbed()
      .setTitle('Pong! :ping_pong:')
      .addField('Bot Latency', `${Math.round(lifeguard.ws.ping)}ms`)
      .addField(
        'Message Latency',
        `${m.createdTimestamp - msg.createdTimestamp}ms`
      )
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
