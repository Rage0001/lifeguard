import {Event} from '@events/Event';
import {Guild, TextChannel} from 'discord.js';
import {systemLogChannel} from '@lifeguard/config/bot';
import {assert} from '@lifeguard/util/assert';

export const event = new Event(
  'guildDelete',
  async (lifeguard, guild: Guild) => {
    lifeguard.user?.setPresence({
      activity: {
        name: `${lifeguard.users.cache.size} people in the pool`,
        type: 'WATCHING',
      },
      status: 'online',
    });
    const modlog = lifeguard.channels.resolve(systemLogChannel);
    assert(
      modlog instanceof TextChannel,
      `${systemLogChannel} is not a TextChannel`
    );
    modlog.send(
      `:outbox_tray: **${lifeguard.user?.tag}** has left **${guild.name}**`
    );
  }
);
