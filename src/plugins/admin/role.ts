import { Command } from '@plugins/Command';
import { parseUser } from '@util/parseUser';

export const command = new Command(
  'role',
  async (lifeguard, msg, args) => {
    const [cmd, uid, rid, ...r] = args;
    const u = parseUser(uid);
    const role = await msg.guild?.roles.fetch(rid);
    switch (cmd) {
      case 'add':
        if (role) {
          const member = await msg.guild?.members.fetch(u);
          member?.roles.add(role, r.join(' '));
          msg.channel.send(`Added ${role.name} to ${member}`);
        }
        break;

      case 'rmv':
        if (role) {
          const member = await msg.guild?.members.fetch(u);
          member?.roles.remove(role, r.join(' '));
          msg.channel.send(`Removed ${role.name} from ${member}`);
        }
        break;

      default:
        break;
    }
  },
  {
    level: 1,
    usage: [
      'role add {user} {role id} [reason]',
      'role rmv {user} {role id} [reason]',
    ],
  }
);