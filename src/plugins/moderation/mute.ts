import { UserInfraction } from '@models/User';
import { Command } from '@plugins/Command';
import { defaultEmbed } from '@util/DefaultEmbed';
import { parseUser } from '@util/parseUser';

export const command = new Command(
  'mute',
  async (lifeguard, msg, [uid, ...reason]) => {
    // Get guild from db
    const guild = await lifeguard.db.guilds.findOne({ id: msg.guild?.id });
    // Check if muted role exists
    if (guild?.config.roles?.muted) {
      // Parse user id from mention
      const u = parseUser(uid);
      try {
        // Create Infracrion
        const inf: UserInfraction = {
          action: 'Mute',
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
        // Add role to user
        await member?.roles.add(guild.config.roles.muted);

        // Tell moderator action was successfull
        msg.channel.send(
          `${member?.user.tag} was muted by ${msg.author.tag} for \`${
            reason.length > 0 ? reason.join(' ') : 'No Reason Specified'
          }\``
        );
      } catch (err) {
        msg.channel.send(err.message);
      }
    } else {
      const embed = defaultEmbed()
        .setTitle(':rotating_light: Error! :rotating_light:')
        .setDescription('No mute role configured!');
      msg.channel.send(embed);
    }
  },
  {
    level: 1,
    usage: ['mute {user} [reason]'],
  }
);
