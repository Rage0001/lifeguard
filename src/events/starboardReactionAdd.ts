import {Event} from '@events/Event';
import {defaultEmbed} from '@util/DefaultEmbed';
import {TextChannel, MessageReaction} from 'discord.js';

export const event = new Event(
  'starboardReactionAdd',
  async (lifeguard, reaction: MessageReaction) => {
    const dbGuild = await lifeguard.db.guilds.findById(
      reaction.message.guild?.id
    );
    if (dbGuild?.config.starboard && dbGuild.config.channels?.starboard) {
      const starboardChannel = reaction.message.guild?.channels.resolve(
        dbGuild.config.channels.starboard
      ) as TextChannel;
      const starboard = dbGuild.config.starboard;
      if (
        starboardChannel &&
        !starboard.ignoredChannels.includes(reaction.message.channel.id)
      ) {
        console.log(reaction.count, starboard.minCount);
        if (reaction.count && reaction.count >= starboard.minCount) {
          const starboardMessage = starboard.messages.find(
            m => m.id === reaction.message.id
          );
          if (starboardMessage) {
            const starboardMessageInChannel = await starboardChannel.messages.fetch(
              starboardMessage.starboardID
            );
            starboardMessage.count = reaction.count ?? starboardMessage.count;
            const embed = defaultEmbed()
              .setAuthor(
                starboardMessageInChannel?.author.tag,
                starboardMessageInChannel?.author.avatarURL() ?? ''
              )
              .setDescription(
                `${reaction.message.content}\n\n ➥ [Jump To Message](https://discordapp.com/channels/${reaction.message.guild?.id}/${reaction.message.channel.id}/${reaction.message.id})`
              );
            starboardMessageInChannel?.edit(
              `${starboard.emoji} ${reaction.count} ${reaction.message.channel} (${reaction.message.id})`,
              embed
            );
          } else {
            const embed = defaultEmbed()
              .setAuthor(
                reaction.message.author.tag,
                reaction.message.author.avatarURL() ?? ''
              )
              .setDescription(
                `${reaction.message.content}\n\n ➥ [Jump To Message](https://discordapp.com/channels/${reaction.message.guild?.id}/${reaction.message.channel.id}/${reaction.message.id})`
              );
            const starboardMessage = await starboardChannel.send(
              `${starboard.emoji} ${reaction.count} ${reaction.message.channel} (${reaction.message.id})`,
              embed
            );
            starboard.messages.push({
              id: reaction.message.id,
              starboardID: starboardMessage.id,
              content: reaction.message.content,
              count: reaction.count ?? 0,
            });
          }
          // await lifeguard.db.guilds.updateOne(
          //   { id: dbGuild.id },
          //   { $set: { 'config.starboard': starboard } }
          // );
          await lifeguard.db.guilds.findByIdAndUpdate(dbGuild._id, {
            $set: {'config.starboard': starboard},
          });
        }
      }
    }
  }
);
