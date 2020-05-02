import {Event} from '@events/Event';
import {MessageReaction, User} from 'discord.js';

export const event = new Event(
  'messageReactionAdd',
  async (lifeguard, reaction: MessageReaction, user: User) => {
    await lifeguard.db.users.findByIdAndUpdate(user.id, {
      $inc: {'stats.totalTimesReacted': 1},
    });

    const dbGuild = await lifeguard.db.guilds.findById(
      reaction.message.guild?.id
    );
    if (
      dbGuild?.config.channels.starboard &&
      reaction.emoji.name === dbGuild?.config.starboard?.emoji
    ) {
      lifeguard.emit('starboardReactionAdd', reaction);
    }
  }
);
