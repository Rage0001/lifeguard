import {
  Guild,
  GuildAuditLogsFetchOptions,
  GuildChannel,
  TextChannel,
  User,
} from 'discord.js';

import {Event} from '@events/Event';
import {assert} from '@lifeguard/util/assert';
import {strFmt} from '@lifeguard/util/strFmt';
import {toSnake} from '@lifeguard/util/camelToSnake';

export const event = new Event(
  'messageDeleteBulk',
  async (lifeguard, messages) => {
    const msgs = [...messages.values()];

    assert(msgs[0].guild instanceof Guild, `${msgs[0].guild} is not a Guild`);

    const logChannels = await lifeguard.getLogChannels(
      msgs[0].guild.id,
      event.name
    );

    logChannels.forEach(async modlog => {
      const auditLog = await modlog.guild.fetchAuditLogs({
        type: toSnake(event.name) as GuildAuditLogsFetchOptions['type'],
      });
      const auditLogEntry = auditLog.entries.first();

      assert(
        msgs[0].channel instanceof TextChannel,
        `${msgs[0].channel} is not a TextChannel`
      );

      assert(
        auditLogEntry?.target instanceof GuildChannel,
        `${auditLogEntry?.target} is not a user`
      );

      const modID = lifeguard.pending.cleans.get(auditLogEntry.target.id);
      const mod = lifeguard.users.resolve(modID ?? auditLogEntry.executor.tag);

      assert(mod instanceof User, `${mod} is not a User`);

      modlog.send(
        strFmt(
          ':wastebasket: {count} messages in **#{channel}** were deleted by **{user}**.',
          {
            count: (auditLogEntry.extra as {count: number}).count.toString(),
            channel: auditLogEntry.target.name,
            user: mod.tag,
          }
        )
      );
    });
  }
);
