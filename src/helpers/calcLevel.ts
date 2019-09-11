import { Guild, GuildMember } from "discord.js";
import { findGuild } from "../models/Guild";
import { config } from "../private/config";

export async function calcLevel(user: GuildMember, guild: Guild) {
  const guildConfig = await findGuild(guild.id);
  if (guildConfig) {
    if (config.developers.indexOf(user.id) !== -1) {
      return 5;
    }
    if (user.id === guild.ownerID) {
      return 4;
    }
    if (user.hasPermission("ADMINISTRATOR")) {
      return 3;
    }
    if (user.roles.has(guildConfig.modRole)) {
      return 2;
    }
  }
  return 0;
}
