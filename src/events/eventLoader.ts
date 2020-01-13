import { Client } from 'discord.js';
import { readdir } from 'fs';
import { promisify } from 'util';
import { Event } from './Event';

const readDir = promisify(readdir);

export async function EventLoader(lifeguard: Client) {
  const eventFiles = await readDir('./build/src/events');

  for await (const file of eventFiles) {
    if (file.endsWith('js') && file !== 'Event.js') {
      const { event } = require(`./${file}`);
      if (event instanceof Event) {
        lifeguard.on(event.name, (...args: []) => {
          event.func(lifeguard, ...args);
        });
      }
    }
  }
}
