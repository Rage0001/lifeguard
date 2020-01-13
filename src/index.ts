import { token } from './config/bot';
import { EventLoader } from './events/eventLoader';
import { PluginLoader } from './plugins/pluginLoader';
import { PluginClient } from './PluginClient';

const lifeguard = new PluginClient();

EventLoader(lifeguard);
PluginLoader().then(plugins => {
  lifeguard.plugins = plugins;
});

lifeguard.login(token).then(() => {
  if (lifeguard.user) {
    console.log(
      `Logged in to ${lifeguard.user.username}#${lifeguard.user.discriminator}`
    );
  }
});
