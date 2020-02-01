import { Command } from '@plugins/Command';
import { parseUser } from '@util/parseUser';
import { MessageAttachment } from 'discord.js';

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
        const u = parseUser(user);
        const dbUser = await lifeguard.db.users.findOne({ id: u });
        const inf = dbUser?.infractions.find(inf => inf.id === +infID);
        msg.channel.send(`\`\`\`json\n${JSON.stringify(inf, null, 2)}\n\`\`\``);
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
