import { Schema } from "mongoose";

export const Infraction = new Schema({
  action: String,
  active: Boolean,
  guild: String,
  id: Number,
  moderator: String,
  reason: String,
  time: Date
});

export interface IInfraction {
  action: string;
  active: boolean;
  guild: string;
  id: number;
  moderator: string;
  reason: string;
  time: Date;
}
