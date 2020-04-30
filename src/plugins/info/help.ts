import { calcUserLevel } from '@assertions/userLevel';
import { Command } from '@plugins/Command';
import { Plugin } from '@plugins/Plugin';
import { defaultEmbed } from '@util/DefaultEmbed';
import { Collection, Guild, GuildMember, MessageEmbed } from 'discord.js';
import { PluginClient } from '@lifeguard/PluginClient';

async function convertPlugins(
  lifeguard: PluginClient,
  plugins: Collection<string, Plugin>,
  member: GuildMember,
  guild: Guild
): Promise<Array<{ name: string; cmds: string[] } | null>> {
  const guildDB = await lifeguard.db.guilds.findById(guild.id);
  return plugins
    .map((plugin, key) => {
      if (guildDB?.config.enabledPlugins?.includes(plugin.name)) {
        return {
          name: key,
          cmds: [...plugin.values()]
            .filter(cmd => !cmd.options.hidden)
            .filter(cmd => calcUserLevel(member, guild) >= cmd.options.level)
            .map(cmd => cmd.name)
            .sort((a, b) => a.localeCompare(b)),
        };
      } else {
        return null;
      }
    })
    .sort((a, b) => {
      if (a?.name && b?.name) {
        return a.name.localeCompare(b.name);
      } else {
        return 0;
      }
    });
}

export const command: Command = new Command(
  'help',
  async (lifeguard, msg, args) => {
    if (!args.length) {
      const plugins: Array<{
        name: string;
        cmds: string[];
      } | null> = await convertPlugins(
        lifeguard,
        lifeguard.plugins,
        msg.member as GuildMember,
        msg.guild as Guild
      );

      const embed: MessageEmbed = defaultEmbed()
        .setTitle('Lifeguard Help')
        .setFooter(
          `Executed By ${msg.author.tag}`,
          msg.author.avatarURL() ?? msg.author.defaultAvatarURL
        );

      for (const plugin of plugins) {
        if (plugin?.cmds && plugin.cmds.length > 0) {
          embed.addFields({ name: plugin.name, value: plugin.cmds.join('\n') });
        }
      }

      msg.channel.send(embed);
    } else {
      const plugin: Plugin | undefined = lifeguard.plugins.find(plugin =>
        plugin.has(args[0])
      );
      const cmd: Command | undefined = plugin?.get(args[0]);

      if (cmd) {
        const embed: MessageEmbed = defaultEmbed()
          .setTitle(cmd.name)
          .setFooter(
            `Executed By ${msg.author.tag}`,
            msg.author.avatarURL() ?? msg.author.defaultAvatarURL
          );

        const options: Array<[string, string[] & string]> = Object.entries(
          cmd.options
        );
        options.map(([key, val]) => {
          if (key === 'usage') {
            embed.addFields({ name: key, value: val.join('\n') });
            return;
          }
          embed.addFields({ name: key, value: `${val}` });
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
