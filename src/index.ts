import 'module-alias/register';

import {EventLoader} from '@events/eventLoader';
import {PluginClient} from '@lifeguard/PluginClient';
import {PluginLoader} from '@plugins/pluginLoader';
import {performance} from 'perf_hooks';
import {token} from '@config/bot';

const lifeguard: PluginClient = new PluginClient();

EventLoader(lifeguard).then(() => lifeguard.logger.info('Loaded Events'));
PluginLoader(lifeguard).then(() => lifeguard.logger.info('Loaded Plugins'));

const dbConnectStart = performance.now();
lifeguard.db
  .connect()
  .then(() => {
    const dbConnectEnd = performance.now();
    lifeguard.logger.info('Connected to MongoDB');
    lifeguard.logger.debug(
      `[MongoDB]: Connected to MongoDB (+${Math.round(
        dbConnectEnd - dbConnectStart
      )}ms)`
    );
    const loginStart = performance.now();
    lifeguard.login(token).then(() => {
      if (lifeguard.user) {
        const loginEnd = performance.now();
        lifeguard.logger.info(
          `Logged in to ${lifeguard.user.username}#${lifeguard.user.discriminator}`
        );
        lifeguard.logger.debug(
          `[discord.js]: Logged In (+${Math.round(loginEnd - loginStart)}ms)`
        );
      }
    });
  })
  .catch(err => lifeguard.logger.error(err));

process.on('uncaughtException', err => {
  if (err.stack) {
    lifeguard.logger.error(err.stack);
  }
});

process.on('SIGINT', () => {
  lifeguard.logger.info('Received Ctrl-C, Shutting Down Gracefully');
  lifeguard.destroy();
  lifeguard.db.disconnect().then(() => {
    // The following rule is disabled as SIGINT should exit the process.
    // eslint-disable-next-line no-process-exit
    process.exit();
  });
});

process.on('unhandledRejection', err => {
  lifeguard.logger.error(JSON.stringify(err, null, 2));
  throw err;
});
