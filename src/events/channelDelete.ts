import {Event} from '@events/Event';
import {GuildAuditLogsFetchOptions} from 'discord.js';
import {strFmt} from '@lifeguard/util/strFmt';
import {toSnake} from '@lifeguard/util/camelToSnake';

export const event = new Event('channelDelete', async (lifeguard, channel) => {
  const logChannels = await lifeguard.getLogChannels(
    channel.guild.id,
    event.name
  );

  logChannels.forEach(async modlog => {
    const auditLog = await modlog.guild.fetchAuditLogs({
      type: toSnake(event.name) as GuildAuditLogsFetchOptions['type'],
    });
    const auditLogEntry = auditLog.entries.first();
    modlog.send(
      strFmt(':wastebasket: **#{name}** was deleted by **{user}**.', {
        name: channel.name,
        user: auditLogEntry?.executor.tag as string,
      })
    );
  });
});
