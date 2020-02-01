import { Event } from '@events/Event';

export const event = new Event('ready', lifeguard => {
  console.log('Connected to Discord');
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
