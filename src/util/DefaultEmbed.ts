import { MessageEmbed } from 'discord.js';

export function defaultEmbed() {
  return new MessageEmbed().setColor(0x7289da).setTimestamp();
}
