import {Event} from '@events/Event';
import {TextChannel, User} from 'discord.js';
import {assert} from '@lifeguard/util/assert';
import * as dayjs from 'dayjs';

function accountIsNew(creationTimestamp: number) {
  const threshold = 604800000; //1 week in ms
  const now = Date.now();
  return now - creationTimestamp < threshold;
}

export const event = new Event('guildMemberAdd', async (lifeguard, member) => {
  const dbGuild = await lifeguard.db.guilds.findById(member.guild.id);
  if (dbGuild?.config.channels?.logging) {
    const modlog = member.guild.channels.resolve(
      dbGuild.config.channels.logging
    );
    assert(modlog instanceof TextChannel, `${modlog} is not a TextChannel`);
    assert(member.user instanceof User, `${member.user} is not a User`);
    const isNew = accountIsNew(member.user.createdTimestamp);
    modlog.send(
      `:inbox_tray: **${member.user.tag}** has joined. ${
        isNew ? ':new: ' : ''
      }\`created ${dayjs(member.user.createdAt).format('DD/MM/YYYY')}\``
    );
  }
});
