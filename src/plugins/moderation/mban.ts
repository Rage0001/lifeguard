import { Command } from '@plugins/Command';
import { command as ban } from '@plugins/moderation/ban';

export const command = new Command(
  'mban',
  async (lifeguard, msg, args) => {
    // Find where '-r' is  in the args
    const reasonFlagIndex = args.indexOf('-r') || args.length;
    // Get users from args
    const users = args.slice(0, reasonFlagIndex);
    // Get reason from args
    const reason = args.slice(reasonFlagIndex + 1).join(' ');
    // Run ban command for each user
    users.forEach(user => ban.func(lifeguard, msg, [user, reason]));
  },
  {
    level: 1,
    usage: ['mban {users} -r [reason]'],
  }
);
