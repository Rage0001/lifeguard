// import {Document, Schema, model} from 'mongoose';

// export interface GuildConfigStarboardMessage {
//   id: string;
//   starboardID: string;
//   count: number;
//   content: string;
// }

// const guildConfigStarboardMessageSchema: Schema = new Schema({
//   id: {type: String, required: true, unique: true},
//   starboardID: {type: String, required: true, unique: true},
//   count: {type: Number, required: false, default: 0},
//   content: {type: String, required: true},
// });

// export interface GuildConfigStarboard {
//   emoji: string;
//   minCount: number;
//   ignoredChannels: string[];
//   messages: GuildConfigStarboardMessage[];
// }

// const guildConfigStarboardSchema: Schema = new Schema({
//   emoji: {type: String, required: false, default: ''},
//   minCount: {type: Number, required: false, default: 0},
//   ignoredChannels: {type: [String], default: []},
//   messages: {type: [guildConfigStarboardMessageSchema], default: []},
// });

// export interface GuildConfigRoles {
//   muted: string;
//   moderator: string;
// }

// const guildConfigRolesSchema: Schema = new Schema({
//   muted: {type: String, required: false, default: ''},
//   moderator: {type: String, required: true, default: ''},
// });

// export interface GuildConfigChannels {
//   logging: string;
//   starboard: string;
// }

// export interface GuildConfig {
//   blacklisted: boolean;
//   channels: GuildConfigChannels;
//   enabledPlugins: string[];
//   starboard: GuildConfigStarboard;
//   roles: GuildConfigRoles;
// }

// const guildConfigSchema: Schema = new Schema({
//   blacklisted: {type: Boolean, required: true, default: false},
//   channels: {
//     logging: {type: String, required: false, default: ''},
//     starboard: {type: String, required: false, default: ''},
//   },
//   enabledPlugins: {
//     type: [String],
//     required: true,
//     default: ['debug', 'dev', 'info', 'moderation', 'admin'],
//   },
//   starboard: {type: guildConfigStarboardSchema},
//   roles: {type: guildConfigRolesSchema},
// });

// export interface GuildDoc extends Document {
//   _id: string;
//   config: GuildConfig;
// }

// const guildSchema: Schema = new Schema({
//   _id: {type: String},
//   config: {type: guildConfigSchema},
// });

// export const guild = model<GuildDoc>('Guilds', guildSchema);

import {Document, Schema, model} from 'mongoose';

import {prefix} from '@lifeguard/config/bot';

export interface FilterChannel {
  blockedWords: string[];
}

interface PluginConfig {
  enabled: boolean;
}

export interface StarboardConfig {
  emoji: string;
  minimumCount: number;
  ignoredChannels: string[];
  messages: Map<string, {id: string; count: number}>;
}

export interface GuildConfig {
  commands: {
    prefix: string;
  };
  filter: {
    blockedWords: string[];
    channels: Map<string, FilterChannel>;
    invites: boolean;
    inviteWhitelist: string[];
    maxMentions: number;
    maxLines: number;
    ignoredUsers: string[];
    ignoredRoles: string[];
    ignoredChannels: string[];
  };
  logging: {
    enabled: boolean;
    channels: Map<string, string[]>;
  };
  plugins: Map<string, PluginConfig>;
  starboard: Map<string, StarboardConfig>;
  roles: {
    muted: string;
    moderator: string;
    admin: string;
  };
}

export interface GuildDoc extends Document {
  _id: string;
  blacklisted: boolean;
  config: GuildConfig;
}

const guildSchema: Schema = new Schema({
  _id: String,
  blacklisted: {type: Boolean, default: false, required: false},
  config: {
    commands: {
      prefix: {type: String, default: prefix, required: false},
    },
    filter: {
      blockedWords: [String],
      channels: {
        type: Map,
        of: {blockedWords: [String]},
        required: false,
      },
      invites: {type: Boolean, default: false, required: false},
      inviteWhitelist: [String],
      maxMentions: {type: Number, default: 0},
      maxLines: {type: Number, default: 0},
      ignoredUsers: [String],
      ignoredRoles: [String],
      ignoredChannels: [String],
    },
    logging: {
      enabled: {type: Boolean, default: false, required: false},
      channels: {type: Map, of: [String], required: false},
    },
    plugins: {
      type: Map,
      of: {enabled: Boolean},
      default: {
        info: {enabled: true},
        moderation: {enabled: true},
        dev: {enabled: true},
        debug: {enabled: true},
        admin: {enabled: true},
      },
    },
    starboard: {
      type: Map,
      of: {
        emoji: String,
        minimumCount: Number,
        ignoredChannels: [String],
        messages: {type: Map, of: {id: String, count: Number}},
      },
    },
    roles: {
      muted: {type: String, default: '', required: false},
      moderator: {type: String, default: '', required: false},
      admin: {type: String, default: '', required: false},
    },
  },
});

export const guild = model<GuildDoc>('Guilds', guildSchema);
