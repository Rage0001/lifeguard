import { Command } from '@plugins/Command';
import { parseUser } from '@util/parseUser';
import { MessageAttachment } from 'discord.js';
import { defaultEmbed } from '@lifeguard/util/DefaultEmbed';

export const command = new Command(
  'infractions',
  async (lifeguard, msg, [cmd, ...args], dbUser) => {
    switch (cmd) {
      case 'archive':
        // Get users from Database that have infractions
        const dbUsers = lifeguard.db.users.find({
          infractions: { $elemMatch: { guild: msg.guild?.id } },
        });

        const guildInfractions = (
          await dbUsers
            // Filter out infractions not from current guild
            .map(u => u.infractions.filter(inf => inf.guild === msg.guild?.id))
            .toArray()
        )
          // Flatten Array
          .reduce((acc, val) => acc.concat(val), []);

        // Send archive as JSON file
        msg.channel.send(
          new MessageAttachment(
            Buffer.from(JSON.stringify(guildInfractions, null, 2)),
            `${msg.guild?.id}.infractions.json`
          )
        );
        break;

      case 'info':
        const [user, infID] = args;
        if (!user) {
          msg.channel.send('You must specify a user.');
          break;
        }
        const u = parseUser(user);
        const resolvedUser = lifeguard.users.resolve(u);
        if (!resolvedUser) {
          msg.channel.send('No user was found with that information.');
          break;
        }
        if (!infID) {
          msg.channel.send('You must specify an infraction ID.');
          break;
        }
        const dbUser = await lifeguard.db.users.findOne({ id: u });
        const inf = dbUser?.infractions.find(inf => inf.id === +infID);
        if (!inf) {
          msg.channel.send(
            `No infraction for ${resolvedUser.tag} could be found using that ID.`
          );
          break;
        }

        const embed = defaultEmbed().setDescription(
          `Type: ${inf.action}\nActive: ${inf.active}\nGuild: ${
            lifeguard.guilds.resolve(inf.guild)?.name
          } (${inf.guild})\nInfraction #: ${infID}\nModerator: ${
            lifeguard.users.resolve(inf.moderator)?.tag
          } (${inf.moderator}\nReason: ${inf.reason}\nTime: ${inf.time})`
        );

        // msg.channel.send(`\`\`\`json\n${JSON.stringify(inf, null, 2)}\n\`\`\``);
        msg.channel.send(embed);
        break;

      default:
        break;
    }
  },
  {
    level: 1,
    usage: [
      'infractions archive',
      'infractions search {user}',
      'infractions info {user} {id}',
    ],
    alias: ['inf'],
  }
);
