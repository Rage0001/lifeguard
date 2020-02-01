import { Command } from '@plugins/Command';
import { command as kick } from '@plugins/moderation/kick';

export const command = new Command(
  'mkick',
  async (lifeguard, msg, args) => {
    // Find where '-r' is  in the args
    const reasonFlagIndex = args.indexOf('-r');
    // Get users from args
    const uids = args.slice(0, reasonFlagIndex);
    // Get reason from args
    const reason = args.slice(reasonFlagIndex + 1).join(' ');
    // Run ban command for each user
    uids.forEach(uid => kick.func(lifeguard, msg, [uid, reason]));
  },
  {
    level: 1,
    usage: ['mkick {users} -r [reason]'],
  }
);
