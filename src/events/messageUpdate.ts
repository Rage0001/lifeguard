import { Event } from '@events/Event';
import { TextChannel } from 'discord.js';
import { getDiff } from 'recursive-diff';
import { assert } from '@lifeguard/util/assert';

interface Diff {
  op: string;
  path: (string | number)[];
  val: any;
  oldVal?: any;
}

export const event = new Event(
  'messageUpdate',
  async (lifeguard, oldMessage, newMessage) => {
    const dbGuild = await lifeguard.db.guilds.findById(newMessage.guild?.id);
    if (dbGuild?.config.channels?.logging) {
      const modlog = newMessage.guild?.channels.resolve(
        dbGuild.config.channels.logging
      );

      assert(modlog instanceof TextChannel, `${modlog} is not a TextChannel`);

      assert(
        newMessage.channel instanceof TextChannel,
        `${newMessage.channel} is not a TextChannel`
      );

      const orig = { ...oldMessage.toJSON() };
      const upd = { ...newMessage.toJSON() };

      const diff = getDiff(orig, upd, true).filter((d) => d.op === 'update');

      const ignoredKeys = ['editedTimestamp', 'cleanContent'];

      diff
        .filter((d) => !ignoredKeys.includes(d.path.join('.')))
        .forEach((d: Diff) => {
          modlog.send(
            `:pencil: **#${newMessage.author?.tag}**'s message's ${d.path.join(
              '.'
            )} was updated in **#${
              (newMessage.channel as TextChannel).name
            }**.\n**Old:** ${d.oldVal}\n**New:** ${d.val}`
          );
        });
    }
  }
);
