import { UserInfraction } from '@models/User';
import { Command } from '@plugins/Command';
import { parseUser } from '@util/parseUser';
import { GuildMember, User } from 'discord.js';

export const command = new Command(
  'forceban',
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

      // Ban user from guild
      const member = await msg.guild?.members.ban(u, {
        reason: inf.reason,
      });

      // Retreive user tag
      let tag;
      if (member instanceof GuildMember) {
        tag = member.user.tag;
      } else if (member instanceof User) {
        tag = member.tag;
      } else {
        tag = member;
      }

      // Tell moderator ban was successful
      msg.channel.send(
        `${tag} was force-banned by ${msg.author.toString()} for \`${
          inf.reason
        }\``
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
