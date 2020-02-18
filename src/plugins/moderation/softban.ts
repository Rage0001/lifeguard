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
      const inf: UserInfraction = {
        action: 'Ban',
        active: true,
        guild: msg.guild?.id as string,
        id: (await lifeguard.db.users.findOne({ id: u }))?.infractions
          .length as number,
        moderator: msg.author.id,
        reason: reason.join(' '),
        time: new Date(),
      };

      // Update User in Database
      await lifeguard.db.users.findOneAndUpdate(
        { id: u },
        { $push: { infractions: inf } },
        { returnOriginal: false }
      );

      // Get User
      const member = await msg.guild?.members.fetch(u);
      // Notify user of action
      member?.send(
        `You have been soft-banned from **${msg.guild?.name}** for \`${
          reason.length > 0 ? reason.join(' ') : 'No Reason Specified'
        }`
      );
      // Ban User
      member?.ban({ reason: reason.join(' '), days: 7 });
      // Unban User
      await msg.guild?.members.unban(u, reason.join(' '));

      // Tell moderator action was successfull
      msg.channel.send(
        `${member?.user.tag} was soft-banned by ${msg.author.tag} for \`${
          reason.length > 0 ? reason.join(' ') : 'No Reason Specified'
        }`
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
