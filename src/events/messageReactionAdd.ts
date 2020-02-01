import { Event } from '@events/Event';
import { GuildStructure } from '@structures/GuildStructure';
import { MessageReaction, User } from 'discord.js';

export const event = new Event(
  'messageReactionAdd',
  async (lifeguard, reaction: MessageReaction, user: User) => {
    await lifeguard.db.users.updateOne(
      { id: user.id },
      { $inc: { 'stats.totalTimesReacted': 1 } }
    );
    const dbGuild = await (reaction.message.guild as GuildStructure).db;
    if (
      dbGuild?.config.channels?.starboard &&
      reaction.emoji.name === dbGuild?.config.starboard?.emoji
    ) {
      lifeguard.emit('starboardReactionAdd', reaction);
    }
  }
);
