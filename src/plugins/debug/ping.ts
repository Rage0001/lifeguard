import { Command } from '../Command';
import { MessageEmbed } from 'discord.js';

export const command = new Command(
  'ping',
  async (lifeguard, msg, args) => {
    const m = await msg.channel.send('Ping?');
    m.delete({ timeout: 100 });

    const embed = new MessageEmbed()
      .setTitle('Pong! :ping_pong:')
      .addField('Bot Latency', `${Math.round(lifeguard.ws.ping)}ms`)
      .addField(
        'Message Latency',
        `${m.createdTimestamp - msg.createdTimestamp}ms`
      )
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
    usage: ['ping'],
  }
);
