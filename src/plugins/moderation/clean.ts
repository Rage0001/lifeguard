import {Collection, Message} from 'discord.js';

import {Command} from '@plugins/Command';
import {defaultEmbed} from '@util/DefaultEmbed';

export const command: Command = new Command(
  'clean',
  async (lifeguard, msg, [cmd, ...args]) => {
    let id: string,
      firstID: string,
      secondID: string,
      c: string,
      reason: string[],
      count: number,
      messages: Collection<string, Message> | Message[];
    switch (cmd) {
      case 'all':
        [c, ...reason] = args;
        count = +c;

        messages = await msg.channel.bulkDelete(count + 1, true);

        await msg.channel.send(
          defaultEmbed().setDescription(
            `Deleted ${messages.size} messages for \`${
              reason.length > 0 ? reason.join(' ') : 'No Reason Specified'
            }\``
          )
        );
        lifeguard.pending.cleans.set(msg.channel.id, msg.author.id);
        break;
      case 'bots':
        [c, ...reason] = args;
        count = +c;

        messages = await msg.channel.messages.fetch({}, true);
        messages = messages.filter(m => m.author.bot).array();
        messages.length = count;
        // messages.forEach(m => m.delete());
        await msg.channel.bulkDelete(messages, true);

        await msg.channel.send(
          defaultEmbed().setDescription(
            `Deleted ${messages.length} messages for \`${
              reason.length > 0 ? reason.join(' ') : 'No Reason Specified'
            }\``
          )
        );
        lifeguard.pending.cleans.set(msg.channel.id, msg.author.id);
        break;
      case 'user':
        [id, c, ...reason] = args;
        count = +c;

        messages = await msg.channel.messages.fetch({}, true);
        messages = messages.filter(m => m.author.id === id).array();
        messages.length = count + 1;
        // messages.forEach(m => m.delete());
        await msg.channel.bulkDelete(messages, true);

        await msg.channel.send(
          defaultEmbed().setDescription(
            `Deleted ${messages.length} messages for \`${
              reason.length > 0 ? reason.join(' ') : 'No Reason Specified'
            }\``
          )
        );
        lifeguard.pending.cleans.set(msg.channel.id, msg.author.id);
        break;
      case 'before':
        [id, c, ...reason] = args;
        count = +c;

        messages = await msg.channel.messages.fetch(
          {before: id, limit: count},
          true
        );
        // messages.forEach(m => m.delete());
        await msg.channel.bulkDelete(messages, true);

        await msg.channel.send(
          defaultEmbed().setDescription(
            `Deleted ${messages.size} messages for \`${
              reason.length > 0 ? reason.join(' ') : 'No Reason Specified'
            }\``
          )
        );
        lifeguard.pending.cleans.set(msg.channel.id, msg.author.id);
        break;
      case 'after':
        [id, c, ...reason] = args;
        count = +c;

        messages = await msg.channel.messages.fetch(
          count ? {after: id, limit: count} : {after: id},
          true
        );
        // messages.forEach(m => m.delete());
        await msg.channel.bulkDelete(messages, true);

        await msg.channel.send(
          defaultEmbed().setDescription(
            `Deleted ${messages.size} messages for \`${
              reason.length > 0 ? reason.join(' ') : 'No Reason Specified'
            }\``
          )
        );
        lifeguard.pending.cleans.set(msg.channel.id, msg.author.id);
        break;
      case 'between':
        [firstID, secondID, ...reason] = args;

        messages = await msg.channel.messages.fetch({after: firstID}, true);
        messages = messages.filter(m => m.id <= secondID);
        // messages.forEach(m => m.delete());
        await msg.channel.bulkDelete(messages, true);

        await msg.channel.send(
          defaultEmbed().setDescription(
            `Deleted ${messages.size} messages for \`${
              reason.length > 0 ? reason.join(' ') : 'No Reason Specified'
            }\``
          )
        );
        lifeguard.pending.cleans.set(msg.channel.id, msg.author.id);
        break;
      default:
        break;
    }
  },
  {
    level: 2,
    usage: [
      'clean all {count} [reason]',
      'clean bots {count} [reason]',
      'clean user {id} {count} [reason]',
      'clean before {id} {count} [reason]',
      'clean after {id} {count} [reason]',
      'clean between {firstID} {secondID} [reason]',
    ],
  }
);
