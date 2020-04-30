import { Event } from '@events/Event';
import { TextChannel } from 'discord.js';
import { assert } from '@lifeguard/util/assert';

export const event = new Event(
  'guildUpdate',
  async (lifeguard, _oldGuild, newGuild) => {
    const dbGuild = await lifeguard.db.guilds.findById(newGuild.id);
    if (dbGuild?.config.channels?.logging) {
      const modlog = newGuild.channels.resolve(dbGuild.config.channels.logging);

      assert(modlog instanceof TextChannel, `${modlog} is not a TextChannel`);

      const auditLog = await newGuild.fetchAuditLogs({
        type: 'GUILD_UPDATE',
      });
      const auditLogEntry = auditLog.entries.first();
      const changes = auditLogEntry?.changes ?? [];
      changes.forEach((change) => {
        modlog.send(
          `:pencil: **${newGuild.name}**'s ${change.key} was updated by **${auditLogEntry?.executor.tag}**.\n**Old:** ${change.old}\n**New:** ${change.new}`
        );
      });
    }
  }
);
