import {Event} from '@events/Event';
import {assert} from '@lifeguard/util/assert';
import {TextChannel, GuildChannel} from 'discord.js';

export const event = new Event(
  'messageDeleteBulk',
  async (lifeguard, messages) => {
    const msgs = [...messages.values()];
    const dbGuild = await lifeguard.db.guilds.findById(msgs[0].guild?.id);
    if (dbGuild?.config.channels?.logging) {
      const modlog = msgs[0].guild?.channels.resolve(
        dbGuild.config.channels.logging
      );

      assert(modlog instanceof TextChannel, `${modlog} is not a TextChannel`);

      const auditLog = await msgs[0].guild?.fetchAuditLogs({
        type: 'MESSAGE_BULK_DELETE',
      });

      const auditLogEntry = auditLog?.entries.first();

      assert(
        auditLogEntry?.target instanceof GuildChannel,
        `${auditLogEntry?.target} is not a user`
      );

      const modID = lifeguard.pending.cleans.get(auditLogEntry.target.id);
      const mod = lifeguard.users.resolve(modID ?? '');

      if (auditLogEntry.reason) {
        modlog.send(
          `:wastebasket: **${
            (auditLogEntry.extra as {count: number}).count
          } messages** in **#${auditLogEntry.target.name}** were deleted by **${
            mod?.tag ?? auditLogEntry.executor.tag
          }** for \`${auditLogEntry.reason}\``
        );
      } else {
        modlog.send(
          `:wastebasket: **${
            (auditLogEntry.extra as {count: number}).count
          } messages** in **#${auditLogEntry.target.name}** were deleted by **${
            mod?.tag ?? auditLogEntry.executor.tag
          }**`
        );
      }
    }
  }
);
