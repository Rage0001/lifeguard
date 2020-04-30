import { Command } from '@plugins/Command';
import { parseUser } from '@util/parseUser';
import { InfractionDoc } from '@lifeguard/database/Infraction';
import { GuildMember } from 'discord.js';

export const command: Command = new Command(
  'softban',
  async (lifeguard, msg, [uid, ...reason]) => {
    // Parse user id from mention
    const u: string = parseUser(uid);
    try {
      // Create Infraction
      const inf: InfractionDoc = await lifeguard.db.infractions.create({
        action: 'Ban',
        active: true,
        guild: msg.guild?.id as string,
        moderator: msg.author.id,
        reason: reason.join(' '),
        user: u,
      });

      lifeguard.pending.bans.set(inf.user, inf.moderator);

      // Get User
      const member: GuildMember | undefined = await msg.guild?.members.fetch(u);
      // Notify user of action
      member?.send(
        `You have been soft-banned from **${msg.guild?.name}** for \`${
          inf.reason ?? 'No Reason Specified'
        }`
      );
      // Ban User
      await member?.ban({ reason: inf.reason, days: 7 });
      // Unban User
      await msg.guild?.members.unban(u, inf.reason);
      lifeguard.pending.unbans.set(inf.user, inf.moderator);

      // Tell moderator action was successfull
      msg.channel.send(
        `${member?.user.tag} was soft-banned by ${msg.author.tag} for \`${
          inf.reason ?? 'No Reason Specified'
        }`
      );
    } catch (err) {
      msg.channel.send(err.message);
    }
  },
  {
    level: 1,
    usage: ['softban {user} [reason]'],
  }
);
