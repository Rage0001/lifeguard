import {ClientUser, TextChannel} from 'discord.js';

import {Event} from '@events/Event';
import {assert} from '@lifeguard/util/assert';
import {strFmt} from '@lifeguard/util/strFmt';
import {systemLogChannel} from '@lifeguard/config/bot';

export const event = new Event('guildCreate', (lifeguard, guild) => {
  const modlog = lifeguard.channels.resolve(systemLogChannel);
  assert(modlog instanceof TextChannel, `${modlog} is not a TextChannel`);
  if (lifeguard.readyTimestamp) {
    assert(
      lifeguard.user instanceof ClientUser,
      `${lifeguard.user} is not a ClientUser`
    );

    lifeguard.user.setPresence({
      activity: {
        name: `${lifeguard.users.cache.size} people in the pool`,
        type: 'WATCHING',
      },
      status: 'online',
    });

    modlog.send(
      strFmt(':inbox_tray: **{lifeguard}** has left **{name}**.', {
        lifeguard: lifeguard.user.tag,
        name: guild.name,
      })
    );
  }
});
