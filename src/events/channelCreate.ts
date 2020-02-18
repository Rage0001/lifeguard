import { Event } from '@events/Event';
import { GuildStructure } from '@structures/GuildStructure';
import { defaultEmbed } from '@util/DefaultEmbed';
import { GuildChannel, TextChannel } from 'discord.js';

export const event = new Event(
  'channelCreate',
  async (lifeguard, channel: GuildChannel) => {
    const dbGuild = await (channel.guild as GuildStructure).db;
    if (dbGuild?.config.channels?.logging) {
      const modlog = channel.guild.channels.resolve(
        dbGuild.config.channels.logging
      ) as TextChannel;

      const auditLog = await channel.guild.fetchAuditLogs({
        type: 'CHANNEL_CREATE',
      });
      const auditLogEntry = auditLog.entries.last();

      // const embed = defaultEmbed()
      //   .setDescription(
      //     `:pencil: Channel ${channel.toString()} (${channel.id}) was created`
      //   )
      //   .setTitle('Channel Create');

      // if (auditLogEntry) {
      //   embed.setAuthor(`${auditLogEntry.executor.tag}`);
      // }

      const embed = defaultEmbed();

      modlog.send(embed);
    }
  }
);
