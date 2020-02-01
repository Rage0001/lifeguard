import { calcUserLevel } from '@assertions/userLevel';
import { Command } from '@plugins/Command';
import { Plugin } from '@plugins/Plugin';
import { defaultEmbed } from '@util/DefaultEmbed';
import { Collection, Guild, GuildMember } from 'discord.js';

function convertPlugins(
  plugins: Collection<string, Plugin>,
  member: GuildMember,
  guild: Guild
) {
  return plugins
    .map((plugin, key) => ({
      name: key,
      cmds: [...plugin.values()]
        .filter(cmd => !cmd.options.hidden)
        .filter(cmd => calcUserLevel(member, guild) >= cmd.options.level)
        .map(cmd => cmd.name)
        .sort((a, b) => a.localeCompare(b)),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export const command = new Command(
  'help',
  (lifeguard, msg, args) => {
    if (!args.length) {
      const plugins = convertPlugins(
        lifeguard.plugins,
        msg.member as GuildMember,
        msg.guild as Guild
      );

      const embed = defaultEmbed()
        .setTitle('Lifeguard Help')
        .setFooter(
          `Executed By ${msg.author.tag}`,
          msg.author.avatarURL() ?? msg.author.defaultAvatarURL
        );

      for (const plugin of plugins) {
        if (plugin.cmds.length > 0) {
          embed.addField(plugin.name, plugin.cmds.join('\n'));
        }
      }

      msg.channel.send(embed);
    } else {
      const plugin = lifeguard.plugins.find(plugin => plugin.has(args[0]));
      const cmd = plugin?.get(args[0]);

      if (cmd) {
        const embed = defaultEmbed()
          .setTitle(cmd.name)
          .setFooter(
            `Executed By ${msg.author.tag}`,
            msg.author.avatarURL() ?? msg.author.defaultAvatarURL
          );

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
