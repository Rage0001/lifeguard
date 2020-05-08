import {GuildMember, MessageEmbed} from 'discord.js';

import {Command} from '@plugins/Command';
import {GuildDoc} from '@lifeguard/database/Guild';
import {defaultEmbed} from '@util/DefaultEmbed';
import {parseUser} from '@util/parseUser';

export const command: Command = new Command(
  'unmute',
  async (lifeguard, msg, [uid, ...reason]) => {
    // Get guild from database
    const guild: GuildDoc | null = await lifeguard.db.guilds.findOne({
      id: msg.guild?.id,
    });
    // Check if muted role exists
    if (guild?.config.roles?.muted) {
      // Parse user id from mention
      const u: string = parseUser(uid);
      try {
        // Get User
        const member: GuildMember | undefined = await msg.guild?.members.fetch(
          u
        );
        // Remove Role
        await member?.roles.remove(guild.config.roles.muted);
        // Tell moderator action was successfull
        msg.channel.send(
          `${member?.user.tag} was unmuted by ${msg.author.tag} for \`${
            reason.length > 0 ? reason.join(' ') : 'No Reason Specified'
          }\``
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
    usage: ['unmute {user} [reason]'],
  }
);
