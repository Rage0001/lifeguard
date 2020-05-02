import {Event} from '@events/Event';

export const event = new Event('invalidated', async lifeguard => {
  lifeguard.logger.error('Client session has invalidated.');
  throw new Error('Client session has invalidated.');
});
