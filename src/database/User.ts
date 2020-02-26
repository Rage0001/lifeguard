import { Document, Schema, model } from 'mongoose';

interface UserStats {
  totalSentMessages: number;
  totalSentCharacters: number;
  totalDeletedMessages: number;
  totalCustomEmojisUsed: number;
  totalTimesMentionedAUser: number;
  totalSentAttachments: number;
  totalTimesReacted: number;
  mostUsedReaction: string;
}

const userStatsSchema: Schema = new Schema({
  totalSentMessages: { type: Number, default: 0 },
  totalSentCharacters: { type: Number, default: 0 },
  totalDeletedMessages: { type: Number, default: 0 },
  totalCustomEmojisUsed: { type: Number, default: 0 },
  totalTimesMentionedAUser: { type: Number, default: 0 },
  totalSentAttachments: { type: Number, default: 0 },
  totalTimesReacted: { type: Number, default: 0 },
  mostUsedReaction: { type: String, default: '' },
});

export interface UserDoc extends Document {
  blacklisted: boolean;
  _id: string;
  stats: UserStats;
}

const userSchema: Schema = new Schema({
  _id: { type: String },
  blacklisted: { type: Boolean, default: false },
  stats: { type: userStatsSchema, required: false },
});

export const user = model<UserDoc>('Users', userSchema);
