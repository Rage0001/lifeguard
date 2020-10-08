import {Event} from '@events/Event';
import {TextChannel} from 'discord.js';
import {assert} from '@lifeguard/util/assert';
import {systemLogChannel} from '@lifeguard/config/bot';

export const event = new Event('error', async (lifeguard, error) => {
  const modlog = lifeguard.channels.resolve(systemLogChannel);
  assert(
    modlog instanceof TextChannel,
    `${systemLogChannel} is not a TextChannel`
  );
  modlog.send(
    `:rotating_light: **ERROR:** ${error.message}\n\n**Stack Trace:**\n${error.stack}`
  );
});
