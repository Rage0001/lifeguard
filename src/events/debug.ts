import {Event} from '@events/Event';
import {TextChannel} from 'discord.js';
import {assert} from '@lifeguard/util/assert';
import {systemLogChannel} from '@lifeguard/config/bot';

export const event = new Event('debug', async (lifeguard, info) => {
  if (process.env.NODE_ENV === 'development') {
    if (!lifeguard.readyTimestamp) {
      lifeguard.logger.debug(info);
    } else {
      const modlog = lifeguard.channels.resolve(systemLogChannel);
      assert(
        modlog instanceof TextChannel,
        `${systemLogChannel} is not a TextChannel`
      );
      modlog.send(`:tools: **DEBUG:** ${info}`);
    }
  }
});
