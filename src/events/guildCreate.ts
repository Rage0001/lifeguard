import { Event } from './Event';

export const event = new Event('guildCreate', lifeguard => {
  if (lifeguard.user) {
    lifeguard.user.setPresence({
      activity: {
        name: `${lifeguard.users.size} people in the pool`,
        type: 'WATCHING',
      },
      status: 'online',
    });
  }
});
