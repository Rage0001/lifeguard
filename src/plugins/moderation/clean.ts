import { Command } from '@plugins/Command';
import { defaultEmbed } from '@util/DefaultEmbed';

export const command = new Command(
  'clean',
  async (lifeguard, msg, [cmd, ...args]) => {
    let id: string,
      firstID: string,
      secondID: string,
      c,
      reason,
      count,
      messages;
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
        break;
      case 'bots':
        [c, ...reason] = args;
        count = +c;

        messages = await msg.channel.messages.fetch({}, true);
        messages = messages.filter(m => m.author.bot).array();
        messages.length = count;
        messages.forEach(m => m.delete());

        await msg.channel.send(
          defaultEmbed().setDescription(
            `Deleted ${messages.length} messages for \`${
              reason.length > 0 ? reason.join(' ') : 'No Reason Specified'
            }\``
          )
        );
        break;
      case 'user':
        [id, c, ...reason] = args;
        count = +c;

        messages = await msg.channel.messages.fetch({}, true);
        messages = messages.filter(m => m.author.id === id).array();
        messages.length = count + 1;
        messages.forEach(m => m.delete());

        await msg.channel.send(
          defaultEmbed().setDescription(
            `Deleted ${messages.length} messages for \`${
              reason.length > 0 ? reason.join(' ') : 'No Reason Specified'
            }\``
          )
        );
        break;
      case 'before':
        [id, c, ...reason] = args;
        count = +c;

        messages = await msg.channel.messages.fetch(
          { before: id, limit: count },
          true
        );
        messages.forEach(m => m.delete());

        await msg.channel.send(
          defaultEmbed().setDescription(
            `Deleted ${messages.size} messages for \`${
              reason.length > 0 ? reason.join(' ') : 'No Reason Specified'
            }\``
          )
        );
        break;
      case 'after':
        [id, c, ...reason] = args;
        count = +c;

        messages = await msg.channel.messages.fetch(
          count ? { after: id, limit: count } : { after: id },
          true
        );
        messages.forEach(m => m.delete());

        await msg.channel.send(
          defaultEmbed().setDescription(
            `Deleted ${messages.size} messages for \`${
              reason.length > 0 ? reason.join(' ') : 'No Reason Specified'
            }\``
          )
        );
        break;
      case 'between':
        [firstID, secondID, ...reason] = args;

        messages = await msg.channel.messages.fetch({ after: firstID }, true);
        messages = messages.filter(m => m.id <= secondID);
        messages.forEach(m => m.delete());

        await msg.channel.send(
          defaultEmbed().setDescription(
            `Deleted ${messages.size} messages for \`${
              reason.length > 0 ? reason.join(' ') : 'No Reason Specified'
            }\``
          )
        );
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
