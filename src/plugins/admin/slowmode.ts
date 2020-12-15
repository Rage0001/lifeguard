import {Command} from '@plugins/Command';
import {TextChannel} from 'discord.js';

export const command = new Command<[string, number]>(
  'slowmode',
  async (lifeguard, msg, [cmd, time]) => {
    switch (cmd) {
      case 'set':
        if (msg.guild) {
          (msg.channel as TextChannel).setRateLimitPerUser(time);
          msg.channel.send(
            `Slowmode has been set to 1 message every ${time} seconds`
          );
        }
        break;

      case 'off':
        if (msg.guild) {
          (msg.channel as TextChannel).setRateLimitPerUser(0);
          msg.channel.send('Slowmode has been turned off');
        }
        break;

      default:
        break;
    }
  },
  {
    level: 1,
    usage: ['slowmode set {time}', 'slowmode off'],
    expectedArgs: ['string', 'number?'],
  }
);
