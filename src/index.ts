import 'module-alias/register';

import {token} from '@config/bot';
import {EventLoader} from '@events/eventLoader';
import {PluginClient} from '@lifeguard/PluginClient';
import {PluginLoader} from '@plugins/pluginLoader';

const lifeguard: PluginClient = new PluginClient();

EventLoader(lifeguard);
PluginLoader().then(plugins => {
  lifeguard.plugins = plugins;
});

lifeguard.db
  .connect()
  .then(() => {
    lifeguard.logger.info('Connected to MongoDB');
    lifeguard.login(token).then(() => {
      if (lifeguard.user) {
        lifeguard.logger.info(
          `Logged in to ${lifeguard.user.username}#${lifeguard.user.discriminator}`
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
