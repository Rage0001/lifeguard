import { Command } from '@plugins/Command';
import { defaultEmbed } from '@util/DefaultEmbed';
import { Collection, Message } from 'discord.js';

export const command: Command = new Command(
  'archive',
  async (lifeguard, msg, [cmd, ...args]) => {
    let id: string,
      firstID: string,
      secondID: string,
      c: string,
      reason: string[],
      count: number,
      messages: Collection<string, Message> | Message[],
      msgs: string[];
    switch (cmd) {
      case 'all':
        [c, ...reason] = args;
        count = +c;

        messages = await msg.channel.messages.fetch({ limit: count + 1 });

        msgs = messages.map(
          (m) =>
            `[${new Date(m.createdTimestamp).toISOString()}] - ${
              m.author.tag
            } (${m.author.id}): ${m.cleanContent}`
        );
        msgs.shift();
        lifeguard.logger.debug(msgs.reverse().join('\n'));

        break;
      case 'bots':
        [c, ...reason] = args;
        count = +c;

        messages = await msg.channel.messages.fetch({}, true);
        messages = messages.filter((m) => m.author.bot).array();
        messages.length = count;

        msgs = messages.map(
          (m) =>
            `[${new Date(m.createdTimestamp).toISOString()}] - ${
              m.author.tag
            } (${m.author.id}): ${m.cleanContent}`
        );
        msgs.shift();
        lifeguard.logger.debug(msgs.reverse().join('\n'));

        break;
      case 'user':
        [id, c, ...reason] = args;
        count = +c;

        messages = await msg.channel.messages.fetch({}, true);
        messages = messages.filter((m) => m.author.id === id).array();
        messages.length = count;

        msgs = messages.map(
          (m) =>
            `[${new Date(m.createdTimestamp).toISOString()}] - ${
              m.author.tag
            } (${m.author.id}): ${m.cleanContent}`
        );
        msgs.shift();
        lifeguard.logger.debug(msgs.reverse().join('\n'));

        break;
      case 'before':
        [id, c, ...reason] = args;
        count = +c;

        messages = await msg.channel.messages.fetch(
          { before: id, limit: count },
          true
        );

        msgs = messages.map(
          (m) =>
            `[${new Date(m.createdTimestamp).toISOString()}] - ${
              m.author.tag
            } (${m.author.id}): ${m.cleanContent}`
        );
        msgs.shift();
        lifeguard.logger.debug(msgs.reverse().join('\n'));

        break;
      case 'after':
        [id, c, ...reason] = args;
        count = +c;

        messages = await msg.channel.messages.fetch(
          count ? { after: id, limit: count } : { after: id },
          true
        );

        msgs = messages.map(
          (m) =>
            `[${new Date(m.createdTimestamp).toISOString()}] - ${
              m.author.tag
            } (${m.author.id}): ${m.cleanContent}`
        );
        msgs.shift();
        lifeguard.logger.debug(msgs.reverse().join('\n'));

        break;
      case 'between':
        [firstID, secondID, ...reason] = args;

        messages = await msg.channel.messages.fetch({ after: firstID }, true);
        messages = messages.filter((m) => m.id <= secondID);

        msgs = messages.map(
          (m) =>
            `[${new Date(m.createdTimestamp).toISOString()}] - ${
              m.author.tag
            } (${m.author.id}): ${m.cleanContent}`
        );
        msgs.shift();
        lifeguard.logger.debug(msgs.reverse().join('\n'));

        break;
      default:
        break;
    }
  },
  {
    level: 2,
    usage: [
      'archive all {count} [reason]',
      'archive bots {count} [reason]',
      'archive user {id} {count} [reason]',
      'archive before {id} {count} [reason]',
      'archive after {id} {count} [reason]',
      'archive between {firstID} {secondID} [reason]',
    ],
  }
);
