import { PluginClient } from '../PluginClient';
import {
  ClientEvents,
  Message,
  MessageReaction,
  GuildChannel,
  User,
} from 'discord.js';
import { UserDoc } from '@lifeguard/database/User';

export interface LifeguardEvents extends ClientEvents {
  lifeguardCommandUsed: [Message, UserDoc];
  starboardReactionAdd: [MessageReaction];
  channelCreate: [GuildChannel];
  channelDelete: [GuildChannel];
  messageReactionAdd: [MessageReaction, User];
}

type EventFunc<K extends keyof LifeguardEvents> = (
  lifeguard: PluginClient,
  ...args: LifeguardEvents[K]
) => void;

export class Event<K extends keyof LifeguardEvents> {
  constructor(public name: K, public func: EventFunc<K>) {}
}
