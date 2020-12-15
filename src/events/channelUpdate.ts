import {GuildAuditLogsFetchOptions, GuildChannel} from 'discord.js';

import {Event} from '@events/Event';
import {assert} from '@lifeguard/util/assert';
import {strFmt} from '@lifeguard/util/strFmt';
import {toSnake} from '@lifeguard/util/camelToSnake';

export const event = new Event(
  'channelUpdate',
  async (lifeguard, _oldChannel, newChannel) => {
    assert(
      newChannel instanceof GuildChannel,
      `${newChannel} is not a GuildChannel`
    );

    const logChannels = await lifeguard.getLogChannels(
      newChannel.guild.id,
      event.name
    );

    logChannels.forEach(async modlog => {
      const auditLog = await modlog.guild.fetchAuditLogs({
        type: toSnake(event.name) as GuildAuditLogsFetchOptions['type'],
      });
      const auditLogEntry = auditLog.entries.first();
      const changes = auditLogEntry?.changes ?? [];
      changes.forEach(change => {
        modlog.send(
          strFmt(
            ":pencil: **#{name}**'s {change} was updated by **{user}**.\n**Old:** {oldVal}\n**New:** {val}",
            {
              name: newChannel.name,
              change: change.key,
              user: auditLogEntry?.executor.tag as string,
              oldVal: change.old as string,
              val: change.new as string,
            }
          )
        );
      });
    });
  }
);
