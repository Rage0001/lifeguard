import {Event} from '@events/Event';
import {promisify} from 'util';
import {exec} from 'child_process';

export const event = new Event('ready', async lifeguard => {
  // console.log('Connected to Discord');
  lifeguard.logger.info('Connected to Discord');
  if (process.env.NODE_ENV !== 'DEV') {
    lifeguard.user?.setPresence({
      activity: {
        name: `${lifeguard.users.cache.size} people in the pool • lg.help`,
        type: 'WATCHING',
      },
      status: 'online',
    });
  } else {
    const run = promisify(exec);
    const {stdout: gitCommitString} = await run(
      "git log -n 1 --pretty='format:%C(auto)%h | %s'"
    );
    lifeguard.user?.setPresence({
      activity: {
        name: gitCommitString,
        type: 'PLAYING',
      },
      status: 'online',
    });
  }
});
