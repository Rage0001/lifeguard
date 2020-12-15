import {Event, LifeguardEvents} from '@events/Event';

import {PluginClient} from '@lifeguard/PluginClient';
import {performance} from 'perf_hooks';
import {promisify} from 'util';
import {readdir} from 'fs';

const readDir = promisify(readdir);

export async function EventLoader(lifeguard: PluginClient) {
  const eventFiles = await readDir('./build/src/events');

  for await (const file of eventFiles) {
    if (file.endsWith('js') && file !== 'Event.js') {
      const eventLoadStart = performance.now();
      const {event} = await import(`./${file}`);
      if (event instanceof Event) {
        lifeguard.on(event.name as keyof LifeguardEvents, (...args: []) => {
          event.func(lifeguard, ...args);
        });
        const eventLoadEnd = performance.now();
        lifeguard.logger.debug(
          `[EventLoader]: Loaded ${event.name} (+${Math.round(
            eventLoadEnd - eventLoadStart
          )}ms)`
        );
      }
    }
  }
}
