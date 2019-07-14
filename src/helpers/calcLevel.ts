import { Guild, GuildMember } from "discord.js";
import { config } from "../private/config";

export function calcLevel(user: GuildMember, guild: Guild) {
  if (config.developers.indexOf(user.id) !== -1) {
    return 5;
  }
  if (user.id === guild.ownerID) {
    return 4;
  }
  if (user.hasPermission("ADMINISTRATOR")) {
    return 3;
  }
  return 0;
}
