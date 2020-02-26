import { prefix } from '@config/bot';
import { Event } from '@events/Event';
import { Message } from 'discord.js';

export const event = new Event('message', async (lifeguard, msg: Message) => {
  let dbUser = await lifeguard.db.users.findById(msg.author.id);
  if (!dbUser) {
    dbUser = await lifeguard.db.users.create({
      _id: msg.author.id,
      blacklisted: false,
      stats: {},
    });
  }

  if (msg.guild) {
    const dbGuild = await lifeguard.db.guilds.findById(msg.guild.id);
    if (!dbGuild) {
      await lifeguard.db.guilds.create({
        _id: msg.guild.id,
        config: {
          blacklisted: false,
          enabledPlugins: ['debug', 'dev', 'global', 'info', 'moderation', 'admin'],
        },
      });
    }
  }

  if (dbUser && dbUser.stats) {
    dbUser.stats.totalSentMessages++;
    dbUser.stats.totalSentCharacters += msg.content.length;
    dbUser.stats.totalCustomEmojisUsed +=
      msg.content.match(/<.[^ ]*>/)?.length ?? 0;
    dbUser.stats.totalTimesMentionedAUser += msg.mentions.users.size;
    dbUser.stats.totalSentAttachments += msg.attachments.size;

    await lifeguard.db.users.findByIdAndUpdate(dbUser._id, {
      $set: { stats: dbUser.stats },
    });
  }

  if (msg.content.startsWith(prefix)) {
    lifeguard.emit('lifeguardCommandUsed', msg, dbUser);
  }
});
