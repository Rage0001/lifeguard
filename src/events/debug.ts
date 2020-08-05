import {Event} from '@events/Event';

export const event = new Event('debug', async (lifeguard, info) => {
  if (process.env.NODE_ENV === 'development') {
    lifeguard.logger.debug(info);
  }
});
