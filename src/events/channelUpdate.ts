import { Event } from '@events/Event';
import { GuildChannel, TextChannel } from 'discord.js';
import { assert } from '@lifeguard/util/assert';

export const event = new Event(
  'channelUpdate',
  async (lifeguard, _oldChannel, newChannel) => {
    assert(
      newChannel instanceof GuildChannel,
      `${newChannel} is not a GuildChannel`
    );
    const dbGuild = await lifeguard.db.guilds.findById(newChannel.guild.id);
    if (dbGuild?.config.channels?.logging) {
      const modlog = newChannel.guild.channels.resolve(
        dbGuild.config.channels.logging
      );

      assert(modlog instanceof TextChannel, `${modlog} is not a TextChannel`);

      const auditLog = await newChannel.guild.fetchAuditLogs({
        type: 'CHANNEL_UPDATE',
      });
      const auditLogEntry = auditLog.entries.first();
      const changes = auditLogEntry?.changes ?? [];
      changes.forEach(change => {
        modlog.send(
          `:pencil: **#${newChannel.name}**'s ${change.key} was updated by **${auditLogEntry?.executor.tag}**.\n**Old:** ${change.old}\n**New:** ${change.new}`
        );
      });
    }
  }
);
