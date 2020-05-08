import {Guild, TextChannel, User} from 'discord.js';

import {Event} from '@events/Event';
import {assert} from '@lifeguard/util/assert';
import {getDiff} from 'recursive-diff';
import {strFmt} from '@lifeguard/util/strFmt';

interface Diff {
  op: string;
  path: Array<string | number>;
  val: string;
  oldVal?: string;
}

export const event = new Event(
  'messageUpdate',
  async (lifeguard, oldMessage, newMessage) => {
    assert(
      newMessage.guild instanceof Guild,
      `${newMessage.guild} is not a Guild`
    );

    const logChannels = await lifeguard.getLogChannels(
      newMessage.guild.id,
      event.name
    );

    logChannels.forEach(async modlog => {
      const orig = {...oldMessage.toJSON()};
      const upd = {...newMessage.toJSON()};

      const diff = getDiff(orig, upd, true).filter(d => d.op === 'update');
      const ignoredKeys = ['editedTimestamp', 'cleanContent'];

      diff
        .filter(d => !ignoredKeys.includes(d.path.join('.')))
        .forEach((d: Diff) => {
          assert(
            newMessage.channel instanceof TextChannel,
            `${newMessage.channel} is not a TextChannel`
          );

          assert(
            newMessage.author instanceof User,
            `${newMessage.author} is not a User`
          );

          modlog.send(
            strFmt(
              ":pencil: **${author}**'s message's {change} was updated in **#{channel}**.\n**Old:** {oldVal}\n**New:** {val}",
              {
                author: newMessage.author.tag,
                change: d.path.join('.'),
                channel: newMessage.channel.name,
                oldVal: JSON.stringify(d.oldVal),
                val: JSON.stringify(d.val),
              }
            )
          );
        });
    });
  }
);
