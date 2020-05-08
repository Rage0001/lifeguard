import {Guild, TextChannel} from 'discord.js';

import {Event} from '@events/Event';
import {assert} from '@lifeguard/util/assert';
import {defaultEmbed} from '@util/DefaultEmbed';

export const event = new Event(
  'starboardReactionAdd',
  async (lifeguard, [channel, config], reaction) => {
    assert(
      reaction.message.guild instanceof Guild,
      `${reaction.message.guild} is not a Guild`
    );
    const starboard = reaction.message.guild.channels.resolve(channel);
    assert(
      starboard instanceof TextChannel,
      `${starboard} is not a TextChannel`
    );

    if (reaction.count && reaction.count >= config.minimumCount) {
      const embed = defaultEmbed()
        .setAuthor(
          reaction.message.author.tag,
          reaction.message.author.avatarURL() ?? ''
        )
        .setDescription(
          `${reaction.message.content}\n\n ➥ [Jump To Message](https://discordapp.com/channels/${reaction.message.guild?.id}/${reaction.message.channel.id}/${reaction.message.id})`
        );

      if (config.messages.has(reaction.message.id)) {
        const starboardMessage = config.messages.get(reaction.message.id);
        if (starboardMessage) {
          const starboardMessageInChannel = await starboard.messages.fetch(
            starboardMessage.id
          );

          starboardMessage.count = reaction.count ?? starboardMessage.count;

          starboardMessageInChannel.edit('', embed);
        }
      } else {
        const starboardMessageInChannel = await starboard.send('', embed);
        config.messages.set(starboardMessageInChannel.id, {
          id: reaction.message.id,
          count: reaction.count,
        });
      }

      await lifeguard.db.guilds.findByIdAndUpdate(reaction.message.guild.id, {
        $set: {[`config.starboard.${channel}`]: config},
      });
    }

    // const dbGuild = await lifeguard.db.guilds.findById(
    //   reaction.message.guild.id
    // );
    // if (dbGuild?.config.starboard) {
    //   const channels = [...dbGuild.config.starboard.entries()];
    //   channels.filter(
    //     // The _ unfortunately did nothing in this case
    //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //     ([_channel, config]) => reaction.emoji.name === config.emoji
    //   );
    // }
  }
);

// export const event = new Event(
//   'starboardReactionAdd',
//   async (lifeguard, reaction: MessageReaction) => {
//     const dbGuild = await lifeguard.db.guilds.findById(
//       reaction.message.guild?.id
//     );
//     if (dbGuild?.config.starboard && dbGuild.config.channels?.starboard) {
//       const starboardChannel = reaction.message.guild?.channels.resolve(
//         dbGuild.config.channels.starboard
//       ) as TextChannel;
//       const starboard = dbGuild.config.starboard;
//       if (
//         starboardChannel &&
//         !starboard.ignoredChannels.includes(reaction.message.channel.id)
//       ) {
//         console.log(reaction.count, starboard.minCount);
//         if (reaction.count && reaction.count >= starboard.minCount) {
//           const starboardMessage = starboard.messages.find(
//             m => m.id === reaction.message.id
//           );
//           if (starboardMessage) {
//             const starboardMessageInChannel = await starboardChannel.messages.fetch(
//               starboardMessage.starboardID
//             );
//             starboardMessage.count = reaction.count ?? starboardMessage.count;
//             const embed = defaultEmbed()
//               .setAuthor(
//                 starboardMessageInChannel?.author.tag,
//                 starboardMessageInChannel?.author.avatarURL() ?? ''
//               )
//               .setDescription(
//                 `${reaction.message.content}\n\n ➥ [Jump To Message](https://discordapp.com/channels/${reaction.message.guild?.id}/${reaction.message.channel.id}/${reaction.message.id})`
//               );
//             starboardMessageInChannel?.edit(
//               `${starboard.emoji} ${reaction.count} ${reaction.message.channel} (${reaction.message.id})`,
//               embed
//             );
//           } else {
//             const embed = defaultEmbed()
//               .setAuthor(
//                 reaction.message.author.tag,
//                 reaction.message.author.avatarURL() ?? ''
//               )
//               .setDescription(
//                 `${reaction.message.content}\n\n ➥ [Jump To Message](https://discordapp.com/channels/${reaction.message.guild?.id}/${reaction.message.channel.id}/${reaction.message.id})`
//               );
//             const starboardMessage = await starboardChannel.send(
//               `${starboard.emoji} ${reaction.count} ${reaction.message.channel} (${reaction.message.id})`,
//               embed
//             );
//             starboard.messages.push({
//               id: reaction.message.id,
//               starboardID: starboardMessage.id,
//               content: reaction.message.content,
//               count: reaction.count ?? 0,
//             });
//           }
//           // await lifeguard.db.guilds.updateOne(
//           //   { id: dbGuild.id },
//           //   { $set: { 'config.starboard': starboard } }
//           // );
//           await lifeguard.db.guilds.findByIdAndUpdate(dbGuild._id, {
//             $set: {'config.starboard': starboard},
//           });
//         }
//       }
//     }
//   }
// );
