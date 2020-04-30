import { Command } from "@plugins/Command";
import { command as kick } from "@plugins/moderation/kick";

export const command: Command = new Command(
  "mkick",
  async (lifeguard, msg, args) => {
    // Find where '-r' is  in the args
    const reasonFlagIndex: number = args.indexOf("-r");
    // Get users from args
    const users: string[] = args.slice(0, reasonFlagIndex);
    // Get reason from args
    const reason: string = args.slice(reasonFlagIndex + 1).join(" ");
    // Run ban command for each user
    users.forEach(user => kick.func(lifeguard, msg, [user, reason]));
  },
  {
    level: 1,
    usage: ["mkick {users} -r [reason]"]
  }
);
