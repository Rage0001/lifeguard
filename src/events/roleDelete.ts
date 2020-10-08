import {Guild, GuildAuditLogsFetchOptions} from 'discord.js';

import {Event} from '@events/Event';
import {assert} from '@lifeguard/util/assert';
import {strFmt} from '@lifeguard/util/strFmt';
import {toSnake} from '@lifeguard/util/camelToSnake';

export const event = new Event('roleDelete', async (lifeguard, role) => {
  assert(role.guild instanceof Guild, `${role} is not a Guild`);

  const logChannels = await lifeguard.getLogChannels(role.guild.id, event.name);

  logChannels.forEach(async modlog => {
    const auditLog = await modlog.guild.fetchAuditLogs({
      type: toSnake(event.name) as GuildAuditLogsFetchOptions['type'],
    });
    const auditLogEntry = auditLog.entries.first();
    modlog.send(
      strFmt(':wastebasket: **@{role}** was deleted by **{user}**', {
        role: role.name,
        user: auditLogEntry?.executor.tag as string,
      })
    );
  });
});
