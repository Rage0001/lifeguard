import { ObjectId } from 'bson';
import { PermissionOverwriteOption } from 'discord.js';

export interface UserInfraction {
  action: 'Warn' | 'Kick' | 'Mute' | 'Ban';
  active: boolean;
  guild: string;
  id: number;
  moderator: string;
  reason: string;
  time: Date;
}

export interface UserBackup {
  guild: string;
  id: number;
  roles: string[];
  nickname: string;
  channelOverrides: UserBackupChannelOverride[];
  deafened: boolean;
  muted: boolean;
  createdAt: Date;
}

export interface UserBackupChannelOverride {
  channelId: number;
  overrides: PermissionOverwriteOption;
}

export interface UserStats {
  totalSentMessages: number;
  totalSentCharacters: number;
  totalDeletedMessages: number;
  totalCustomEmojisUsed: number;
  totalTimesMentionedAUser: number;
  totalSentAttachments: number;
  totalTimesReacted: number;
  mostUsedReaction: string;
}

export interface UserReactions {
  [name: string]: number;
}

export interface UserDoc {
  blacklisted?: boolean;
  id: string;
  infractions?: UserInfraction[];
  backups?: UserBackup[];
  stats?: UserStats;
  reactions?: UserReactions;
}

export class User implements UserDoc {
  _id: ObjectId;
  blacklisted: boolean;
  id: string;
  infractions: UserInfraction[];
  backups: UserBackup[];
  stats: UserStats;
  constructor(data: UserDoc) {
    this._id = new ObjectId();
    this.blacklisted = data.blacklisted ?? false;
    this.id = data.id;
    this.infractions = data.infractions ?? [];
    this.backups = data.backups ?? [];
    this.stats = data.stats ?? {
      totalSentMessages: 0,
      totalSentCharacters: 0,
      totalDeletedMessages: 0,
      totalCustomEmojisUsed: 0,
      totalTimesMentionedAUser: 0,
      totalSentAttachments: 0,
      totalTimesReacted: 0,
      mostUsedReaction: '',
    };
  }
}
