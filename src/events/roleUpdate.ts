import {Guild, GuildAuditLogsFetchOptions, User} from 'discord.js';

import {Event} from '@events/Event';
import {assert} from '@lifeguard/util/assert';
import {getDiff} from 'recursive-diff';
import {strFmt} from '@lifeguard/util/strFmt';
import {toSnake} from '@lifeguard/util/camelToSnake';

interface Diff {
  op: string;
  path: Array<string | number>;
  val: string;
  oldVal?: string;
}

export const event = new Event(
  'roleUpdate',
  async (lifeguard, oldRole, newRole) => {
    assert(newRole.guild instanceof Guild, `${newRole.guild} is not a Guild`);

    const logChannels = await lifeguard.getLogChannels(
      newRole.guild.id,
      event.name
    );

    logChannels.forEach(async modlog => {
      const auditLog = await modlog.guild.fetchAuditLogs({
        type: toSnake(event.name) as GuildAuditLogsFetchOptions['type'],
      });
      const auditLogEntry = auditLog.entries.first();

      const orig = {...oldRole.toJSON()};
      const upd = {...newRole.toJSON()};

      const diff = getDiff(orig, upd, true).filter(d => d.op === 'update');
      const ignoredKeys = [''];

      const changes = auditLogEntry?.changes ?? [];
      changes.forEach(change => {
        assert(
          auditLogEntry?.executor instanceof User,
          `${auditLogEntry?.executor} is not a User`
        );

        modlog.send(
          strFmt(
            ":pencil: **@${role}**'s ${change} was updated by **${user}**.\n**Old:** ${oldVal}\n**New:** ${val}",
            {
              role: newRole.name,
              change: change.key,
              user: auditLogEntry.executor.tag,
              oldVal: change.old,
              val: change.new,
            }
          )
        );
      });
      diff
        .filter(d => !ignoredKeys.includes(d.path.join('.')))
        .forEach((d: Diff) => {
          modlog.send(
            strFmt(
              ":pencil: **@${role}**'s ${change} was updated.\n**Old:** ${oldVal}\n**New:** ${val}",
              {
                role: newRole.name,
                change: d.path.join('.'),
                oldVal: JSON.stringify(d.oldVal),
                val: JSON.stringify(d.val),
              }
            )
          );
        });
    });
  }
);
