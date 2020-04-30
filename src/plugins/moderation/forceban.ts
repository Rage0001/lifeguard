import { Command } from '@plugins/Command';
import { parseUser } from '@util/parseUser';
import { GuildMember, User } from 'discord.js';
import { InfractionDoc } from '@lifeguard/database/Infraction';

export const command: Command = new Command(
  'forceban',
  async (lifeguard, msg, [uid, ...reason]) => {
    // Parse user id from mention
    const u: string = parseUser(uid);
    try {
      const inf: InfractionDoc = await lifeguard.db.infractions.create({
        action: 'Ban',
        active: true,
        guild: msg.guild?.id,
        moderator: msg.author.id,
        reason: reason.join(' '),
        user: u,
      });

      lifeguard.pending.bans.set(inf.user, inf.moderator);

      // Ban user from guild
      const member:
        | string
        | User
        | GuildMember
        | undefined = await msg.guild?.members.ban(u, {
        reason: inf.reason,
      });

      // Retreive user tag
      let tag: string;
      if (member instanceof GuildMember) {
        tag = member.user.tag;
      } else if (member instanceof User) {
        tag = member.tag;
      } else {
        tag = member as string;
      }

      // Tell moderator ban was successful
      msg.channel.send(
        `${tag} was force-banned by ${msg.author} for \`${inf.reason ??
          'No Reason Specified'}\``
      );
    } catch (err) {
      msg.channel.send(err.message);
    }
  },
  {
    level: 1,
    usage: ['forceban {user} [reason]'],
  }
);
