import {Command} from '@plugins/Command';
import {defaultEmbed} from '@util/DefaultEmbed';
import {parseUser} from '@util/parseUser';
import {InfractionDoc} from '@lifeguard/database/Infraction';
import {GuildMember, MessageEmbed} from 'discord.js';

export const command: Command = new Command(
  'mute',
  async (lifeguard, msg, [uid, ...reason]) => {
    // Get guild from db
    const guild = await lifeguard.db.guilds.findOne({id: msg.guild?.id});
    // Check if muted role exists
    if (guild?.config.roles?.muted) {
      // Parse user id from mention
      const u = parseUser(uid);
      try {
        //  Create Infracrion
        const inf: InfractionDoc = await lifeguard.db.infractions.create({
          action: 'Mute',
          active: true,
          guild: msg.guild?.id as string,
          moderator: msg.author.id,
          reason: reason.join(' '),
          user: u,
        });

        // Get User
        const member: GuildMember | undefined = await msg.guild?.members.fetch(
          u
        );
        // Add role to user
        await member?.roles.add(guild.config.roles.muted);

        // Tell moderator action was successful
        msg.channel.send(
          `${member?.user.tag} was muted by ${msg.author.tag} for \`${inf.reason}\``
        );
      } catch (err) {
        msg.channel.send(err.message);
      }
    } else {
      const embed: MessageEmbed = defaultEmbed()
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
