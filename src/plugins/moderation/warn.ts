import { UserInfraction } from '@models/User';
import { Command } from '@plugins/Command';
import { parseUser } from '@util/parseUser';

export const command = new Command(
  'warn',
  async (lifeguard, msg, [uid, ...reason]) => {
    // Parse user id from mention
    const u = parseUser(uid);
    try {
      // Create Infracion
      const inf: UserInfraction = {
        action: 'Warn',
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
      const member = msg.guild?.members.get(u);

      // Tell moderator action was sucessfull
      msg.channel.send(
        `${member?.user.tag} was warned by ${msg.author.tag} for \`${
          reason.length > 0 ? reason.join(' ') : 'No Reason Specified'
        }\``
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
