import { Event } from '@events/Event';
import { TextChannel } from 'discord.js';
import { systemLogChannel } from '@lifeguard/config/bot';
import { assert } from '@lifeguard/util/assert';

export const event = new Event('guildUnavailable', async (lifeguard, guild) => {
  const modlog = lifeguard.channels.resolve(systemLogChannel);
  assert(
    modlog instanceof TextChannel,
    `${systemLogChannel} is not a TextChannel`
  );
  modlog.send(`:warning: **${guild.name}** has gone unavailable`);
});
