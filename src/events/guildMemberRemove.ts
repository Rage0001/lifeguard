import {Event} from '@events/Event';
import {TextChannel, User} from 'discord.js';
import {assert} from '@lifeguard/util/assert';

export const event = new Event(
  'guildMemberRemove',
  async (lifeguard, member) => {
    if (
      !(
        lifeguard.pending.bans.has(member.id) ||
        lifeguard.pending.kicks.has(member.id)
      )
    ) {
      const dbGuild = await lifeguard.db.guilds.findById(member.guild.id);
      if (dbGuild?.config.channels?.logging) {
        const modlog = member.guild.channels.resolve(
          dbGuild.config.channels.logging
        );
        assert(modlog instanceof TextChannel, `${modlog} is not a TextChannel`);
        assert(member.user instanceof User, `${member.user} is not a User`);
        modlog.send(`:outbox_tray: **${member.user.tag}** has left.`);
      }
    }
  }
);
