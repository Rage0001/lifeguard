import { Command } from '@plugins/Command';
import { parseUser } from '@util/parseUser';

export const command = new Command(
  'blacklist',
  async (lifeguard, msg, args) => {
    const u = parseUser(args[0]);
    try {
      const res = await lifeguard.db.users.updateOne(
        { _id: u },
        { blacklisted: true }
      );
      console.log(res);
      msg.channel.send(`<@${u}> was sucessfully blacklisted`);
    } catch (err) {
      console.log(err);
      msg.channel.send(err.message);
    }
  },
  {
    level: 4,
    usage: ['blacklist {user}'],
  }
);
