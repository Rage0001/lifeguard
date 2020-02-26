import { UserInfraction } from '@models/User';
import { Command } from '@plugins/Command';
import { parseUser } from '@util/parseUser';

export const command = new Command(
  'ban',
  async (lifeguard, msg, [uid, ...reason]) => {
    // Parse user id from mention
    const u = parseUser(uid);
    try {
      // // Create Infraction
      // const inf: UserInfraction = {
      //   action: 'Ban',
      //   active: true,
      //   guild: msg.guild?.id as string,
      //   id: (await lifeguard.db.users.findOne({ id: u }))?.infractions
      //     .length as number,
      //   moderator: msg.author.id,
      //   reason: reason.join(' '),
      //   time: new Date(),
      // };

      // // Update User in Database
      // await lifeguard.db.users.findOneAndUpdate(
      //   { id: u },
      //   { $push: { infractions: inf } },
      //   { returnOriginal: false }
      // );

      const inf = await lifeguard.db.infractions.create({
        action: 'Ban',
        active: true,
        guild: msg.guild?.id,
        moderator: msg.author.id,
        user: u,
      });

      // Get User
      const member = await msg.guild?.members.fetch(inf.user);
      // Notify User about Action
      member?.send(
        `You have been banned from **${msg.guild?.name}** for \`${inf.reason}\``
      );
      // Ban User
      member?.ban({ reason: inf.reason });

      // Tell moderator action was successful
      msg.channel.send(
        `${member?.user.tag} was banned by ${msg.author.tag} for \`${inf.reason}\``
      );
    } catch (err) {
      msg.channel.send(err.message);
    }
  },
  {
    level: 1,
    usage: ['ban {user} [reason]'],
  }
);
