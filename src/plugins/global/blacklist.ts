import { Command } from '../Command';
import { parseUser } from '../../util/parseUser';

export const command = new Command(
  'blacklist',
  async (lifeguard, msg, args) => {
    const u = parseUser(args[0]);
    try {
      await lifeguard.db.users.findOneAndUpdate(
        { id: u },
        { $set: { blacklisted: true } },
        { returnOriginal: false }
      );
      msg.channel.send(`<@${u}> was sucessfully blacklisted`);
    } catch (err) {
      msg.channel.send(err.message);
    }
  },
  {
    level: 4,
    usage: ['blacklist {user}'],
  }
);
