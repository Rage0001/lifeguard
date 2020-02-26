import { Document, Schema, model } from 'mongoose';
import { GuildDoc } from './Guild';
import { UserDoc } from './User';

export interface InfractionDoc extends Document {
  action: 'Warn' | 'Kick' | 'Mute' | 'Ban';
  active: boolean;
  guild: GuildDoc['_id'];
  _id: number;
  moderator: UserDoc['_id'];
  reason: string;
  time: Date;
  user: UserDoc['_id'];
}

const infractionsSchema: Schema = new Schema({
  action: { type: String, required: true },
  active: { type: Boolean, required: false, default: true },
  guild: { type: String, required: true },
  _id: { type: Number, required: false },
  moderator: { type: String, required: true },
  reason: { type: String, required: false, default: 'No Reason Given' },
  time: { type: Date, required: false, default: Date.now() },
  user: { type: String, required: true },
});

infractionsSchema.pre('save', async function(next) {
  if (this.isNew) {
    this._id = await infraction.countDocuments({});
    return next();
  } else {
    return next();
  }
});

export const infraction = model<InfractionDoc>(
  'Infractions',
  infractionsSchema
);
