import {Event} from '@events/Event';
import {TextChannel} from 'discord.js';
import {assert} from '@lifeguard/util/assert';
import {systemLogChannel} from '@lifeguard/config/bot';

export const event = new Event('rateLimit', async (lifeguard, ratelimit) => {
  const modlog = lifeguard.channels.resolve(systemLogChannel);
  assert(
    modlog instanceof TextChannel,
    `${systemLogChannel} is not a TextChannel`
  );
  modlog.send(
    `:hourglass: **RATELIMIT:** ${JSON.stringify(ratelimit, null, 2)}`
  );
});
