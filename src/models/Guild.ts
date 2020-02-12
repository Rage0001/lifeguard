import { ObjectId } from 'bson';

export interface GuildChannels {
  logging?: string;
  starboard?: string;
}

export interface GuildRoles {
  [key: string]: string | string[] | undefined;
  muted?: string;
  moderator?: string;
  groupRoles?: string[];
  lockedRoles?: string[];
}

export interface GuildStarboardMessage {
  id: string;
  starboardID: string;
  count: number;
  content: string;
}

export interface GuildStarboard {
  emoji: string;
  minCount: number;
  ignoredChannels: string[];
  messages: GuildStarboardMessage[];
}

export interface GuildConfig {
  blacklisted?: boolean;
  channels?: GuildChannels;
  roles?: GuildRoles;
  starboard?: GuildStarboard;
  enabledPlugins?: string[];
}

export interface GuildDoc {
  id: string;
  config?: GuildConfig;
}

export class Guild implements GuildDoc {
  _id: ObjectId;
  id: string;
  config: GuildConfig;
  constructor(data: GuildDoc) {
    this._id = new ObjectId();
    this.id = data.id;
    this.config = data.config ?? {};
    this.config.blacklisted = data.config?.blacklisted ?? false;
  }
}
