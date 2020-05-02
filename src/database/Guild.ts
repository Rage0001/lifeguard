import {Document, Schema, model} from 'mongoose';

export interface GuildConfigStarboardMessage {
  id: string;
  starboardID: string;
  count: number;
  content: string;
}

const guildConfigStarboardMessageSchema: Schema = new Schema({
  id: {type: String, required: true, unique: true},
  starboardID: {type: String, required: true, unique: true},
  count: {type: Number, required: false, default: 0},
  content: {type: String, required: true},
});

export interface GuildConfigStarboard {
  emoji: string;
  minCount: number;
  ignoredChannels: string[];
  messages: GuildConfigStarboardMessage[];
}

const guildConfigStarboardSchema: Schema = new Schema({
  emoji: {type: String, required: false, default: ''},
  minCount: {type: Number, required: false, default: 0},
  ignoredChannels: {type: [String], default: []},
  messages: {type: [guildConfigStarboardMessageSchema], default: []},
});

export interface GuildConfigRoles {
  muted: string;
  moderator: string;
}

const guildConfigRolesSchema: Schema = new Schema({
  muted: {type: String, required: false, default: ''},
  moderator: {type: String, required: true, default: ''},
});

export interface GuildConfigChannels {
  logging: string;
  starboard: string;
}

export interface GuildConfig {
  blacklisted: boolean;
  channels: GuildConfigChannels;
  enabledPlugins: string[];
  starboard: GuildConfigStarboard;
  roles: GuildConfigRoles;
}

const guildConfigSchema: Schema = new Schema({
  blacklisted: {type: Boolean, required: true, default: false},
  channels: {
    logging: {type: String, required: false, default: ''},
    starboard: {type: String, required: false, default: ''},
  },
  enabledPlugins: {
    type: [String],
    required: true,
    default: ['debug', 'dev', 'info', 'moderation', 'admin'],
  },
  starboard: {type: guildConfigStarboardSchema},
  roles: {type: guildConfigRolesSchema},
});

export interface GuildDoc extends Document {
  _id: string;
  config: GuildConfig;
}

const guildSchema: Schema = new Schema({
  _id: {type: String},
  config: {type: guildConfigSchema},
});

export const guild = model<GuildDoc>('Guilds', guildSchema);
