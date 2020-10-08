import {Guild, GuildAuditLogsFetchOptions} from 'discord.js';

import {Event} from '@events/Event';
import {assert} from '@lifeguard/util/assert';
import {strFmt} from '@lifeguard/util/strFmt';
import {toSnake} from '@lifeguard/util/camelToSnake';

export const event = new Event('inviteDelete', async (lifeguard, invite) => {
  assert(invite.guild instanceof Guild, `${invite} is not a Guild`);

  const logChannels = await lifeguard.getLogChannels(
    invite.guild.id,
    event.name
  );

  logChannels.forEach(async modlog => {
    const auditLog = await modlog.guild.fetchAuditLogs({
      type: toSnake(event.name) as GuildAuditLogsFetchOptions['type'],
    });
    const auditLogEntry = auditLog.entries.first();
    modlog.send(
      strFmt(
        ':wastebasket: An invite with the url **<{url}>** was deleted by **{user}**',
        {
          url: invite.url,
          user: auditLogEntry?.executor.tag as string,
        }
      )
    );
  });
});
