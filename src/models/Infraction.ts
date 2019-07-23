import { Schema } from "mongoose";

export const Infraction = new Schema({
  action: String,
  active: Boolean,
  guild: String,
  moderator: String,
  reason: String,
  time: Date,
  user: String
});

export interface IInfraction {
  action: string;
  active: boolean;
  guild: string;
  moderator: string;
  reason: string;
  time: Date;
  user: string;
}
