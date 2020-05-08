import * as dayjs from 'dayjs';

import {GuildMember, User} from 'discord.js';

import {Event} from './Event';
import {assert} from '@lifeguard/util/assert';
import {strFmt} from '@lifeguard/util/strFmt';

function accountIsNew(creationTimestamp: number) {
  const threshold = 604800000; //1 week in ms
  const now = Date.now();
  return now - creationTimestamp < threshold;
}

export const event = new Event('guildMemberAdd', async (lifeguard, member) => {
  assert(member instanceof GuildMember, `${member} is not a GuildMember`);

  const logChannels = await lifeguard.getLogChannels(
    member.guild.id,
    event.name
  );

  logChannels.forEach(modlog => {
    assert(member.user instanceof User, `${member.user} is not a User`);

    modlog.send(
      strFmt(
        ':inbox_tray: **{user}** has joined. {isNew} `created {creationDate}`.',
        {
          user: member.user.tag,
          isNew: accountIsNew(member.user.createdTimestamp) ? ':new:' : '',
          creationDate: dayjs(member.user.createdAt).format('DD/MM/YYYY'),
        }
      )
    );
  });
});
