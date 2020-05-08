import {Event} from '@events/Event';
import {Guild} from 'discord.js';
import {assert} from '@lifeguard/util/assert';

export const event = new Event(
  'messageReactionAdd',
  async (lifeguard, reaction, user) => {
    await lifeguard.db.users.findByIdAndUpdate(user.id, {
      $inc: {'stats.totalTimesReacted': 1},
    });

    assert(
      reaction.message.guild instanceof Guild,
      `${reaction.message.guild} is not a Guild`
    );
    const dbGuild = await lifeguard.db.guilds.findById(
      reaction.message.guild.id
    );
    if (dbGuild?.config.starboard) {
      const channels = [...dbGuild.config.starboard.entries()];
      channels
        .filter(
          // The _ unfortunately did nothing in this case
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([_channel, config]) => reaction.emoji.name === config.emoji
        )
        .forEach(channel => {
          lifeguard.emit('starboardReactionAdd', channel, reaction);
        });
    }
  }
);
