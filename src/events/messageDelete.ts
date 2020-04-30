import { Event } from '@events/Event';
import { TextChannel } from 'discord.js';
import { assert } from '@lifeguard/util/assert';

export const event = new Event('messageDelete', async (lifeguard, message) => {
  const dbGuild = await lifeguard.db.guilds.findById(message.guild?.id);
  if (dbGuild?.config.channels?.logging) {
    const modlog = message.guild?.channels.resolve(
      dbGuild.config.channels.logging
    );

    assert(modlog instanceof TextChannel, `${modlog} is not a TextChannel`);

    const auditLog = await message.guild?.fetchAuditLogs({
      type: 'MESSAGE_DELETE',
    });
    const auditLogEntry = auditLog?.entries.first();

    assert(
      message.channel instanceof TextChannel,
      `${message.channel} is not a TextChannel`
    );

    if (auditLogEntry) {
      modlog.send(
        `:wastebasket: A message by **${message.author?.tag}** in **#${message.channel.name}** was deleted by **${auditLogEntry.executor.tag}**\n\`\`\`${message.content}\`\`\``
      );
    } else {
      modlog.send(
        `:wastebasket: A message by **@${message.author?.tag}** in **#${message.channel.name}** was deleted\n\`\`\`${message.content}\`\`\``
      );
    }
  }
});
