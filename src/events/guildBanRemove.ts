import {Event} from '@events/Event';
import {User} from 'discord.js';
import {assert} from '@lifeguard/util/assert';
import {strFmt} from '@lifeguard/util/strFmt';

export const event = new Event(
  'guildBanRemove',
  async (lifeguard, guild, user) => {
    const logChannels = await lifeguard.getLogChannels(guild.id, event.name);

    logChannels.forEach(async modlog => {
      const auditLog = await modlog.guild.fetchAuditLogs({
        type: 'MEMBER_BAN_REMOVE',
      });
      const auditLogEntry = auditLog.entries.first();

      assert(
        auditLogEntry?.target instanceof User,
        `${auditLogEntry?.target} is not a User`
      );

      const modID = lifeguard.pending.bans.get(auditLogEntry.target.id);
      const mod = lifeguard.users.resolve(modID ?? auditLogEntry.executor.id);

      assert(mod instanceof User, `${mod} is not a User`);

      modlog.send(
        strFmt(':hammer: **{name}** was banned by **{mod}** for `{reason}`.', {
          name: auditLogEntry.target.tag ?? user.tag,
          mod: mod.tag,
          reason: auditLogEntry.reason ?? 'No Reason Specified',
        })
      );
    });
  }
);
