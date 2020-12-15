import {GuildMember, Role, User} from 'discord.js';

import {Command} from '@plugins/Command';

export const command = new Command<[string, User, string, ...string[]]>(
  'role',
  async (lifeguard, msg, [cmd, u, rid, ...r]) => {
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
    expectedArgs: ['string', 'user', 'string'],
  }
);
