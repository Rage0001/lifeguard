import {Command} from '@plugins/Command';
import {parseUser} from '@util/parseUser';

export const command = new Command<string[]>(
  'unban',
  async (lifeguard, msg, [uid, ...reason]) => {
    try {
      const u: string = parseUser(uid);
      const user = await lifeguard.users.fetch(u);
      await msg.guild?.members.unban(user.id, reason.join(' '));
      lifeguard.pending.unbans.set(user.id, msg.author.id);
      msg.channel.send(
        `${user.tag} was unbanned by ${msg.author.tag} for \`${
          reason.join(' ') ?? 'No Reason Specified'
        }\``
      );
    } catch (err) {
      msg.channel.send(err.message);
    }
  },
  {
    level: 1,
    usage: ['ban {user} [reason]'],
  }
);
