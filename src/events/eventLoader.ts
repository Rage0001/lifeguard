import {Event, LifeguardEvents} from '@events/Event';
import {PluginClient} from '@lifeguard/PluginClient';
import {readdir} from 'fs';
import {promisify} from 'util';

const readDir = promisify(readdir);

export async function EventLoader(lifeguard: PluginClient) {
  const eventFiles = await readDir('./build/src/events');

  for await (const file of eventFiles) {
    if (file.endsWith('js') && file !== 'Event.js') {
      const {event} = await import(`./${file}`);
      if (event instanceof Event) {
        lifeguard.on(event.name as keyof LifeguardEvents, (...args: []) => {
          event.func(lifeguard, ...args);
        });
      }
    }
  }
}
