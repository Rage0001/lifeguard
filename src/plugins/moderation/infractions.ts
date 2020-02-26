import { Command } from '@plugins/Command';
import { parseUser } from '@util/parseUser';
import { MessageAttachment } from 'discord.js';
import { defaultEmbed } from '@lifeguard/util/DefaultEmbed';

export const command = new Command(
  'infractions',
  async (lifeguard, msg, [cmd, ...args], dbUser) => {
    let infID;
    switch (cmd) {
      case 'archive':
        const guildInfractions = await lifeguard.db.infractions.find({
          guild: msg.guild?.id,
        });
        // Send archive as JSON file
        msg.channel.send(
          new MessageAttachment(
            Buffer.from(JSON.stringify(guildInfractions, null, 2)),
            `${msg.guild?.id}.infractions.json`
          )
        );
        break;
      case 'info':
        [infID] = args;
        if (!infID) {
          msg.channel.send('You must specify an infraction ID.');
          break;
        }
        const inf = await lifeguard.db.infractions.findOne({
          guild: msg.guild?.id,
          id: +infID,
        });
        if (!inf) {
          msg.channel.send(`No infraction could be found using that ID.`);
          break;
        }
        const embed = defaultEmbed()
          .setTitle(`Info for Infraction ${infID}`)
          .setDescription(
            `Type: ${inf.action}\nActive: ${inf.active}\nGuild: ${
              lifeguard.guilds.resolve(inf.guild)?.name
            } (${inf.guild})\nModerator: ${
              lifeguard.users.resolve(inf.moderator)?.tag
            } (${inf.moderator})\nReason: ${inf.reason}\nTime: ${
              inf.time
            }\nUser: ${lifeguard.users.resolve(inf.user)?.tag} (${inf.user})`
          );
        // msg.channel.send(`\`\`\`json\n${JSON.stringify(inf, null, 2)}\n\`\`\``);
        msg.channel.send(embed);
        break;
      case 'delete':
        [infID] = args;
        if (!infID) {
          msg.channel.send('You must specify an infraction ID.');
          break;
        }
        await lifeguard.db.infractions.deleteOne({ id: +infID });
        msg.channel.send(`Successfully deleted infraction ${infID}`);
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
      'infractions info {id}',
    ],
    alias: ['inf'],
  }
);
