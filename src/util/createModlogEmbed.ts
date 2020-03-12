import { defaultEmbed } from './DefaultEmbed';
import { EmbedFieldData } from 'discord.js';

interface ModlogEmbedActor {
  avatar: string;
  tag: string;
}

interface ModlogEmbedContent {
  actor: ModlogEmbedActor;
  event: string;
  fields?: EmbedFieldData[];
  message?: string;
}

export function createModlogEmbed(content: ModlogEmbedContent) {
  return defaultEmbed()
    .setAuthor(content.actor.tag, content.actor.avatar)
    .setTitle(content.event)
    .setDescription(content.message)
    .addFields(content.fields ?? []);
}
