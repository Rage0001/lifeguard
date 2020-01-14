import { GuildMember, Guild } from 'discord.js';
import { developers } from '../config/bot';

export function calcUserLevel(user: GuildMember, guild: Guild) {
  if (developers.includes(user.id)) {
    return 5;
  }
  if (user.id === guild.ownerID) {
    return 4;
  }
  if (user.permissions.has('ADMINISTRATOR', true)) {
    return 3;
  }
  return 0;
}
