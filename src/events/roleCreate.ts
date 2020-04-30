import { Event } from '@events/Event';
import { TextChannel } from 'discord.js';
import { assert } from '@lifeguard/util/assert';

export const event = new Event('roleCreate', async (lifeguard, role) => {
  const dbGuild = await lifeguard.db.guilds.findById(role.guild.id);
  if (dbGuild?.config.channels?.logging) {
    const modlog = role.guild.channels.resolve(dbGuild.config.channels.logging);
    assert(modlog instanceof TextChannel, `${modlog} is not a TextChannel`);
    const auditLog = await role.guild.fetchAuditLogs({
      type: 'ROLE_CREATE',
    });
    const auditLogEntry = auditLog.entries.first();
    modlog.send(
      `:new: **@${role.name}** was created by **${auditLogEntry?.executor.tag}**`
    );
  }
});