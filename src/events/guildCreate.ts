import { Event } from '@events/Event';
import { Guild } from 'discord.js';

export const event = new Event(
  'guildCreate',
  async (lifeguard, guild: Guild) => {
    if (!(await lifeguard.db.guilds.findById(guild.id))) {
      await lifeguard.db.guilds.create({
        _id: guild.id,
        config: {
          blacklisted: false,
          enabledPlugins: [
            'debug',
            'dev',
            'global',
            'info',
            'moderation',
            'admin',
          ],
        },
      });
    }
    if (lifeguard.user) {
      lifeguard.user.setPresence({
        activity: {
          name: `${lifeguard.users.cache.size} people in the pool`,
          type: 'WATCHING',
        },
        status: 'online',
      });
    }
  }
);
