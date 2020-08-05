import {Command} from '@plugins/Command';
import {parseUser} from '@util/parseUser';

export const command: Command = new Command(
  'unblock',
  async (lifeguard, msg, args) => {
    const u: string = parseUser(args[0]);
    try {
      const res = await lifeguard.db.users.updateOne(
        {_id: u},
        {blocked: false}
      );
      console.log(res);
      msg.channel.send(`<@${u}> was sucessfully unblocked`);
    } catch (err) {
      console.log(err);
      msg.channel.send(err.message);
    }
  },
  {
    level: 4,
    usage: ['block {user}'],
  }
);
