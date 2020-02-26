import { Command } from '@plugins/Command';
import { t as typy } from 'typy';

export const command = new Command(
  'config',
  async (lifeguard, msg, [cmd, ...args]) => {
    const path = args[0];
    switch (cmd) {
      case 'get':
        const guild = await lifeguard.db.guilds.findById(msg.guild?.id);
        if (guild) {
          const config = guild['config'];
          if (path) {
            msg.channel.send(
              `${path} - ${JSON.stringify(
                typy(config, path).safeObject,
                null,
                2
              )}`
            );
          } else {
            msg.channel.send(
              `\`\`\`json\n${JSON.stringify(config, null, 2)}\`\`\``
            );
          }
        }
        break;

      case 'set':
        await lifeguard.db.guilds.findByIdAndUpdate(msg.guild?.id, {
          $set: { [`config.${path}`]: JSON.parse(args[1]) },
        });
        msg.channel.send('Value has been set successfully');
        break;

      default:
        break;
    }
  },
  {
    level: 3,
    usage: ['config get', 'config get {key}', 'config set {key} {value}'],
    hidden: true,
  }
);
