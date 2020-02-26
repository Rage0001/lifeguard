import { UserInfraction } from '@models/User';
import { Command } from '@plugins/Command';
import { parseUser } from '@util/parseUser';

export const command = new Command(
  'softban',
  async (lifeguard, msg, [uid, ...reason]) => {
    // Parse user id from mention
    const u = parseUser(uid);
    try {
      // Create Infraction
      const inf = await lifeguard.db.infractions.create({
        action: 'Ban',
        active: true,
        guild: msg.guild?.id as string,
        moderator: msg.author.id,
        reason: reason.join(' '),
        user: u,
      });

      // Get User
      const member = await msg.guild?.members.fetch(u);
      // Notify user of action
      member?.send(
        `You have been soft-banned from **${msg.guild?.name}** for \`${inf.reason}`
      );
      // Ban User
      member?.ban({ reason: reason.join(' '), days: 7 });
      // Unban User
      await msg.guild?.members.unban(u, reason.join(' '));

      // Tell moderator action was successfull
      msg.channel.send(
        `${member?.user.tag} was soft-banned by ${msg.author.tag} for \`${inf.reason}`
      );
    } catch (err) {
      msg.channel.send(err.message);
    }
  },
  {
    level: 1,
    usage: ['softban {user} [reason]'],
  }
);
