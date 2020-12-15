import {
  ClientEvents,
  GuildChannel,
  Message,
  MessageReaction,
  User,
} from 'discord.js';

import {PluginClient} from '../PluginClient';
import {StarboardConfig} from '@lifeguard/database/Guild';
import {UserDoc} from '@lifeguard/database/User';

export interface LifeguardEvents extends ClientEvents {
  lifeguardCommandUsed: [Message, UserDoc];
  starboardReactionAdd: [[string, StarboardConfig], MessageReaction];
  channelCreate: [GuildChannel];
  channelDelete: [GuildChannel];
  messageReactionAdd: [MessageReaction, User];
  automodTrigger: [Message, string];
}

type EventFunc<K extends keyof LifeguardEvents> = (
  lifeguard: PluginClient,
  ...args: LifeguardEvents[K]
) => void;

export class Event<K extends keyof LifeguardEvents> {
  constructor(public name: K, public func: EventFunc<K>) {}
}
