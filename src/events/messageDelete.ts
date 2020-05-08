import {Guild, GuildAuditLogsFetchOptions, TextChannel, User} from 'discord.js';

import {Event} from '@events/Event';
import {assert} from '@lifeguard/util/assert';
import {strFmt} from '@lifeguard/util/strFmt';
import {toSnake} from '@lifeguard/util/camelToSnake';

export const event = new Event('messageDelete', async (lifeguard, message) => {
  assert(message.guild instanceof Guild, `${message.guild} is not a Guild`);

  const logChannels = await lifeguard.getLogChannels(
    message.guild.id,
    event.name
  );

  logChannels.forEach(async modlog => {
    const auditLog = await modlog.guild.fetchAuditLogs({
      type: toSnake(event.name) as GuildAuditLogsFetchOptions['type'],
    });
    const auditLogEntry = auditLog.entries.first();

    assert(message.author instanceof User, `${message.author} is not a User`);
    assert(
      message.channel instanceof TextChannel,
      `${message.channel} is not a TextChannel`
    );

    if (Date.now() - (auditLogEntry?.createdTimestamp as number) <= 10000) {
      modlog.send(
        strFmt(
          ':wastebasket: A message by **{author}** in **#{channel}** was deleted by **{user}**.\n```{content}```',
          {
            author: message.author.tag,
            channel: message.channel.name,
            user: auditLogEntry?.executor.tag as string,
            content: message.content ?? '',
          }
        )
      );
    } else {
      modlog.send(
        strFmt(
          ':wastebasket: A message by **{author}** in **#{channel}** was deleted.\n```{content}```',
          {
            author: message.author.tag,
            channel: message.channel.name,
            content: message.content ?? '',
          }
        )
      );
    }
  });
});
