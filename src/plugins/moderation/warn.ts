import { Command } from "@plugins/Command";
import { parseUser } from "@util/parseUser";
import { InfractionDoc } from "@lifeguard/database/Infraction";
import { GuildMember } from "discord.js";

export const command: Command = new Command(
  "warn",
  async (lifeguard, msg, [uid, ...reason]) => {
    // Parse user id from mention
    const u: string = parseUser(uid);
    try {
      // Create Infraction
      const inf: InfractionDoc = await lifeguard.db.infractions.create({
        action: "Warn",
        active: true,
        guild: msg.guild?.id as string,
        moderator: msg.author.id,
        reason: reason.join(" "),
        user: u
      });

      // Get User
      const member: GuildMember | undefined = await msg.guild?.members.fetch(
        u
      );

      // Tell moderator action was sucessfull
      msg.channel.send(
        `${member?.user
          .tag} was warned by ${msg.author.tag} for \`${inf.reason}\``
      );
    } catch (err) {
      msg.channel.send(err.message);
    }
  },
  {
    level: 1,
    usage: ["warn {user} [reason]"]
  }
);
