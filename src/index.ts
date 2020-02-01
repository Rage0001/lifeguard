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
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

lifeguard.login(token).then(() => {
  if (lifeguard.user) {
    console.log(
      `Logged in to ${lifeguard.user.username}#${lifeguard.user.discriminator}`
    );
  }
});
