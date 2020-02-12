import { Event } from '@events/Event';
import { Guild } from 'discord.js';

export const event = new Event(
  'guildCreate',
  async (lifeguard, guild: Guild) => {
    await lifeguard.db.guilds.insertOne({
      id: guild.id,
      config: {
        blacklisted: false,
        enabledPlugins: ['debug', 'dev', 'info', 'moderation', 'admin'],
      },
    });
    if (lifeguard.user) {
      lifeguard.user.setPresence({
        activity: {
          name: `${lifeguard.users.size} people in the pool`,
          type: 'WATCHING',
        },
        status: 'online',
      });
    }
  }
);
