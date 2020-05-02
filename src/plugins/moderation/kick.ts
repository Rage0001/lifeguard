import {Command} from '@plugins/Command';
import {parseUser} from '@util/parseUser';
import {InfractionDoc} from '@lifeguard/database/Infraction';
import {GuildMember} from 'discord.js';

export const command: Command = new Command(
  'kick',
  async (lifeguard, msg, [uid, ...reason]) => {
    // Parse user id from mention
    const u: string = parseUser(uid);
    try {
      // Create Infraction
      const inf: InfractionDoc = await lifeguard.db.infractions.create({
        action: 'Kick',
        active: true,
        guild: msg.guild?.id as string,
        moderator: msg.author.id,
        reason: reason.join(' '),
        user: u,
      });

      lifeguard.pending.kicks.set(inf.user, inf.moderator);

      // Get User
      const member: GuildMember | undefined = await msg.guild?.members.fetch(u);
      // Notify User about Action
      member?.send(
        `You have been kicked from **${msg.guild?.name}** for \`${inf.reason}\``
      );
      // Ban the User
      member?.kick(reason.join(' '));

      // Tell moderator action was successful
      msg.channel.send(
        `${member?.user.tag} was kicked by ${msg.author.tag} for \`${inf.reason}\``
      );
    } catch (err) {
      msg.channel.send(err.message);
    }
  },
  {
    level: 1,
    usage: ['kick {user} [reason]'],
  }
);
