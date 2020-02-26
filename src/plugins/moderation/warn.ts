import { UserInfraction } from '@models/User';
import { Command } from '@plugins/Command';
import { parseUser } from '@util/parseUser';
import { infraction } from '@lifeguard/database/Infraction';

export const command = new Command(
  'warn',
  async (lifeguard, msg, [uid, ...reason]) => {
    // Parse user id from mention
    const u = parseUser(uid);
    try {
      // Create Infraction
      const inf = await lifeguard.db.infractions.create({
        action: 'Warn',
        active: true,
        guild: msg.guild?.id as string,
        moderator: msg.author.id,
        reason: reason.join(' '),
        user: u,
      });

      // Get User
      const member = await msg.guild?.members.fetch(u);

      // Tell moderator action was sucessfull
      msg.channel.send(
        `${member?.user.tag} was warned by ${msg.author.tag} for \`${inf.reason}\``
      );
    } catch (err) {
      msg.channel.send(err.message);
    }
  },
  {
    level: 1,
    usage: ['warn {user} [reason]'],
  }
);
