import { Event } from '@events/Event';
import { TextChannel } from 'discord.js';
import { getDiff } from 'recursive-diff';
import { assert } from '@lifeguard/util/assert';

interface Diff {
  op: string;
  path: Array<string | number>;
  val: string;
  oldVal?: string;
}

export const event = new Event(
  'guildMemberUpdate',
  async (lifeguard, oldMember, newMember) => {
    const dbGuild = await lifeguard.db.guilds.findById(newMember.guild.id);
    if (dbGuild?.config.channels?.logging) {
      const modlog = newMember.guild.channels.resolve(
        dbGuild.config.channels.logging
      );

      assert(modlog instanceof TextChannel, `${modlog} is not a TextChannel`);

      const auditLog = await newMember.guild.fetchAuditLogs({
        type: 'MEMBER_UPDATE',
      });
      const auditLogEntry = auditLog.entries.first();
      const changes = auditLogEntry?.changes ?? [];
      if (changes.length > 0) {
        changes.forEach(change => {
          modlog.send(
            `:pencil: **#${newMember.user?.tag}**'s ${change.key} was updated by **${auditLogEntry?.executor.tag}**.\n**Old:** ${change.old}\n**New:** ${change.new}`
          );
        });
      } else {
        const orig = { ...oldMember.toJSON(), user: oldMember.user?.toJSON() };
        const upd = { ...newMember.toJSON(), user: newMember.user?.toJSON() };

        const diff = getDiff(orig, upd, true).filter(d => d.op === 'update');

        const ignoredKeys = ['displayName'];

        diff
          .filter(d => !ignoredKeys.includes(d.path.join('.')))
          .forEach((d: Diff) => {
            modlog.send(
              `:pencil: **#${newMember.user?.tag}**'s ${d.path.join(
                '.'
              )} was updated.\n**Old:** ${d.oldVal}\n**New:** ${d.val}`
            );
          });
      }
    }
  }
);
