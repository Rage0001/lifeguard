import {Command} from '@plugins/Command';
import {parseUser} from '@util/parseUser';
import {Role, GuildMember} from 'discord.js';

export const command: Command = new Command(
  'role',
  async (lifeguard, msg, args) => {
    const [cmd, uid, rid, ...r] = args;
    const u: string = parseUser(uid);
    const role: Role | null | undefined = await msg.guild?.roles.fetch(rid);
    switch (cmd) {
      case 'add':
        if (role) {
          const member:
            | GuildMember
            | undefined = await msg.guild?.members.fetch(u);
          member?.roles.add(role, r.join(' '));
          msg.channel.send(`Added ${role.name} to ${member}`);
        }
        break;

      case 'rmv':
        if (role) {
          const member:
            | GuildMember
            | undefined = await msg.guild?.members.fetch(u);
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
