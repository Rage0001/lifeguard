import { Event } from '@events/Event';
import { GuildChannel, TextChannel } from 'discord.js';
import { createModlogEmbed } from '@lifeguard/util/createModlogEmbed';

export const event = new Event(
  'channelDelete',
  async (lifeguard, channel: GuildChannel) => {
    const dbGuild = await lifeguard.db.guilds.findById(channel.guild.id);
    if (dbGuild?.config.channels?.logging) {
      const modlog = channel.guild.channels.resolve(
        dbGuild.config.channels.logging
      ) as TextChannel;

      const auditLog = await channel.guild.fetchAuditLogs({
        type: 'CHANNEL_DELETE',
      });
      const auditLogEntry = auditLog.entries.first();

      const embed = createModlogEmbed({
        actor: {
          avatar: auditLogEntry?.executor.avatarURL() as string,
          tag: auditLogEntry?.executor.tag as string,
        },
        event: 'Channel Delete',
        message: `:pencil: #${channel.name} (${channel.id})`,
      });

      modlog.send(embed);
    }
  }
);
