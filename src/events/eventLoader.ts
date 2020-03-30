import { Event, LifeguardEvents } from '@events/Event';
import { PluginClient } from '@lifeguard/PluginClient';
import { readdir } from 'fs';
import { promisify } from 'util';
import { ClientEvents } from 'discord.js';

const readDir = promisify(readdir);

export async function EventLoader(lifeguard: PluginClient) {
  const eventFiles = await readDir('./build/src/events');

  for await (const file of eventFiles) {
    if (file.endsWith('js') && file !== 'Event.js') {
      const { event } = require(`./${file}`);
      if (event instanceof Event) {
        lifeguard.on(event.name as keyof ClientEvents, (...args: []) => {
          event.func(lifeguard, ...args);
        });
      }
    }
  }
}
