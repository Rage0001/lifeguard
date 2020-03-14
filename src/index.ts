import 'module-alias/register';

import { token } from '@config/bot';
import { EventLoader } from '@events/eventLoader';
import { PluginClient } from '@lifeguard/PluginClient';
import { PluginLoader } from '@plugins/pluginLoader';
import { StructureLoader } from '@structures/structureLoader';

StructureLoader();

const lifeguard = new PluginClient();

EventLoader(lifeguard);
PluginLoader().then(plugins => {
  lifeguard.plugins = plugins;
});

lifeguard.db
  .connect()
  .then(() => {
    lifeguard.logger.info('Connected to MongoDB');
  })
  .catch(err => lifeguard.logger.error(err));

lifeguard.login(token).then(() => {
  if (lifeguard.user) {
    lifeguard.logger.info(
      `Logged in to ${lifeguard.user.username}#${lifeguard.user.discriminator}`
    );
  }
});

process.on('uncaughtException', err => {
  if (err.stack) {
    lifeguard.logger.error(err.stack);
  }
});

process.on('unhandledRejection', err => {
  lifeguard.logger.error(JSON.stringify(err, null, 2));
});
