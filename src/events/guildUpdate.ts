import {Event} from '@events/Event';
import {GuildAuditLogsFetchOptions} from 'discord.js';
import {strFmt} from '@lifeguard/util/strFmt';
import {toSnake} from '@lifeguard/util/camelToSnake';

export const event = new Event(
  'guildUpdate',
  async (lifeguard, _oldGuild, newGuild) => {
    const logChannels = await lifeguard.getLogChannels(newGuild.id, event.name);

    logChannels.forEach(async modlog => {
      const auditLog = await modlog.guild.fetchAuditLogs({
        type: toSnake(event.name) as GuildAuditLogsFetchOptions['type'],
      });
      const auditLogEntry = auditLog.entries.first();
      const changes = auditLogEntry?.changes ?? [];
      changes.forEach(change => {
        modlog.send(
          strFmt(
            ":pencil: **#{name}**'s {change} was updated by **{user}**.\n**Old:** ${oldVal}\n**New:** ${val}",
            {
              name: newGuild.name,
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
