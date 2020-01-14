import { Command } from '../Command';
import { MessageEmbed, Collection } from 'discord.js';
import { Plugin } from '../Plugin';

function convertPlugins(plugins: Collection<string, Plugin>) {
  return plugins
    .map((plugin, key) => ({
      name: key,
      cmds: [...plugin.values()]
        .filter(cmd => !cmd.options.hidden)
        .map(cmd => cmd.name)
        .sort((a, b) => a.localeCompare(b)),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export const command = new Command(
  'help',
  (lifeguard, msg, args) => {
    if (!args.length) {
      const plugins = convertPlugins(lifeguard.plugins);

      const embed = new MessageEmbed()
        .setTitle('Lifeguard Help')
        .setColor(0x7289da)
        .setFooter(
          `Executed By ${msg.author.tag}`,
          msg.author.avatarURL() ?? msg.author.defaultAvatarURL
        )
        .setTimestamp();

      for (const plugin of plugins) {
        embed.addField(plugin.name, plugin.cmds.join('\n'));
      }

      msg.channel.send(embed);
    } else {
      const plugin = lifeguard.plugins.find(plugin => plugin.has(args[0]));
      const cmd = plugin?.get(args[0]);

      if (cmd) {
        const embed = new MessageEmbed()
          .setTitle(cmd.name)
          .setColor(0x7289da)
          .setFooter(
            `Executed By ${msg.author.tag}`,
            msg.author.avatarURL() ?? msg.author.defaultAvatarURL
          )
          .setTimestamp();

        const options = Object.entries(cmd.options);
        options.map(([key, val]) => {
          if (key === 'usage') {
            embed.addField(key, val.join('\n'));
            return;
          }
          embed.addField(key, `${val}`);
        });

        msg.channel.send(embed);
      }
    }
  },
  {
    level: 0,
    usage: ['help', 'help [name]'],
  }
);
