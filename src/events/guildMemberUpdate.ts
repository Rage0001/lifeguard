import {Event} from '@events/Event';
import {User} from 'discord.js';
import {assert} from '@lifeguard/util/assert';
import {getDiff} from 'recursive-diff';
import {strFmt} from '@lifeguard/util/strFmt';

interface Diff {
  op: string;
  path: Array<string | number>;
  val: string;
  oldVal?: string;
}

export const event = new Event(
  'guildMemberUpdate',
  async (lifeguard, oldMember, newMember) => {
    const logChannels = await lifeguard.getLogChannels(
      newMember.guild.id,
      event.name
    );

    logChannels.forEach(async modlog => {
      const auditLog = await modlog.guild.fetchAuditLogs({
        type: 'MEMBER_UPDATE',
        user: newMember.id,
      });

      const auditLogEntry = auditLog.entries.first();
      const changes = auditLogEntry?.changes ?? [];

      if (changes.length > 0) {
        changes.forEach(change => {
          assert(
            newMember.user instanceof User,
            `${newMember.user} is not a User`
          );
          modlog.send(
            strFmt(
              ":pencil: **{member}**'s {change} was updated by **{user}**.\n**Old:** {oldVal}\n**New:** {val}",
              {
                member: newMember.user.tag,
                change: change.key,
                user: auditLogEntry?.executor.tag as string,
                oldVal: change.old,
                val: change.new,
              }
            )
          );
        });
      } else {
        const orig = {...oldMember.toJSON(), user: oldMember.user?.toJSON()};
        const upd = {...newMember.toJSON(), user: newMember.user?.toJSON()};

        const diff = getDiff(orig, upd, true).filter(d => d.op === 'update');
        const ignoredKeys = ['displayName'];

        diff
          .filter(d => !ignoredKeys.includes(d.path.join('.')))
          .forEach((d: Diff) => {
            assert(
              newMember.user instanceof User,
              `${newMember.user} is not a User`
            );

            modlog.send(
              strFmt(
                ":pencil: **{member}**'s ${change} was updated.\n**Old:** ${oldVal}\n**New:** ${val}",
                {
                  member: newMember.user.tag,
                  change: d.path.join('.'),
                  oldVal: d.oldVal as string,
                  val: d.val as string,
                }
              )
            );
          });
      }
    });
  }
);
