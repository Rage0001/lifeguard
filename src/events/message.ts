import { prefix } from '@config/bot';
import { Event } from '@events/Event';
import { Guild } from '@models/Guild';
import { User } from '@models/User';
import { GuildStructure } from '@structures/GuildStructure';
import { Message } from 'discord.js';

export const event = new Event('message', async (lifeguard, msg: Message) => {
  let dbUser = await lifeguard.db.users.findOne({
    id: msg.author.id,
  });
  if (!dbUser) {
    await lifeguard.db.users.insertOne(new User({ id: msg.author.id }));
    dbUser = await lifeguard.db.users.findOne({
      id: msg.author.id,
    });
  }

  if (msg.guild) {
    const dbGuild = await (msg.guild as GuildStructure).db;
    if (!dbGuild) {
      await lifeguard.db.guilds.insertOne(new Guild({ id: msg.guild.id }));
    }
  }

  if (dbUser) {
    dbUser.stats.totalSentMessages++;
    dbUser.stats.totalSentCharacters += msg.content.length;
    dbUser.stats.totalCustomEmojisUsed +=
      msg.content.match(/<.[^ ]*>/)?.length ?? 0;
    dbUser.stats.totalTimesMentionedAUser += msg.mentions.users.size;
    dbUser.stats.totalSentAttachments += msg.attachments.size;

    await lifeguard.db.users.updateOne(
      { id: dbUser.id },
      { $set: { stats: dbUser.stats } }
    );
  }

  if (msg.content.startsWith(prefix)) {
    lifeguard.emit('lifeguardCommandUsed', msg, dbUser);
  }
});
