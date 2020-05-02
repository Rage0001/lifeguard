import {Event} from '@events/Event';
import {GuildChannel, TextChannel} from 'discord.js';
import {assert} from '@lifeguard/util/assert';

export const event = new Event(
  'channelDelete',
  async (lifeguard, channel: GuildChannel) => {
    const dbGuild = await lifeguard.db.guilds.findById(channel.guild.id);
    if (dbGuild?.config.channels?.logging) {
      const modlog = channel.guild.channels.resolve(
        dbGuild.config.channels.logging
      );

      assert(modlog instanceof TextChannel, `${modlog} is not a TextChannel`);

      const auditLog = await channel.guild.fetchAuditLogs({
        type: 'CHANNEL_DELETE',
      });
      const auditLogEntry = auditLog.entries.first();

      modlog.send(
        `:wastebasket: **#${channel.name}** was deleted by **${auditLogEntry?.executor.tag}**`
      );
    }
  }
);
