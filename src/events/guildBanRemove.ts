import { Event } from '@events/Event';
import { assert } from '@lifeguard/util/assert';
import { TextChannel, User } from 'discord.js';

export const event = new Event(
  'guildBanRemove',
  async (lifeguard, guild, user) => {
    const dbGuild = await lifeguard.db.guilds.findById(guild.id);
    if (dbGuild?.config.channels?.logging) {
      const modlog = guild.channels.resolve(dbGuild.config.channels.logging);

      assert(modlog instanceof TextChannel, `${modlog} is not a TextChannel`);

      const auditLog = await guild.fetchAuditLogs({
        type: 'MEMBER_BAN_REMOVE',
      });

      const auditLogEntry = auditLog.entries.first();

      assert(
        auditLogEntry?.target instanceof User,
        `${auditLogEntry?.target} is not a user`
      );

      const modID = lifeguard.pending.unbans.get(auditLogEntry.target.id);
      const mod = lifeguard.users.resolve(modID ?? '');

      modlog.send(
        `:hammer: **${auditLogEntry.target.tag}** was unbanned by **${
          mod?.tag ?? auditLogEntry.executor.tag
        }** for \`${auditLogEntry.reason ?? 'No Reason Specified'}\``
      );
    }
  }
);
