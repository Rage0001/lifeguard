import {Command} from '@plugins/Command';
import {command as ban} from '@plugins/moderation/ban';

export const command: Command = new Command(
  'mban',
  async (lifeguard, msg, args) => {
    // Find where '-r' is  in the args
    const reasonFlagIndex: number = args.indexOf('-r') || args.length;
    // Get users from args
    const users: string[] = args.slice(0, reasonFlagIndex);
    // Get reason from args
    const reason: string = args.slice(reasonFlagIndex + 1).join(' ');
    // Run ban command for each user
    users.forEach(user => ban.func(lifeguard, msg, [user, reason]));
  },
  {
    level: 1,
    usage: ['mban {users} -r [reason]'],
  }
);
