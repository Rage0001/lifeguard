import { Event } from '@events/Event';
import { TextChannel, GuildChannel } from 'discord.js';
import { assert } from '@lifeguard/util/assert';

export const event = new Event('inviteDelete', async (lifeguard, invite) => {
  assert(
    invite.channel instanceof GuildChannel,
    `${invite.channel} is not a TextChannel`
  );
  const dbGuild = await lifeguard.db.guilds.findById(invite.channel.guild?.id);
  if (dbGuild?.config.channels?.logging) {
    const modlog = invite.channel.guild.channels.resolve(
      dbGuild.config.channels.logging
    );

    assert(modlog instanceof TextChannel, `${modlog} is not a TextChannel`);

    const auditLog = await invite.channel.guild.fetchAuditLogs({
      type: 'INVITE_DELETE',
    });
    const auditLogEntry = auditLog.entries.first();

    modlog.send(
      `:new: An invite with the url **<${invite.url}>** was deleted by **${auditLogEntry?.executor.tag}**`
    );
  }
});
