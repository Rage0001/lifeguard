import { Document, model, Schema } from "mongoose";

export const Starboard = new Schema({
  id: String,
  starCount: {
    default: 0,
    type: Number
  }
});

export interface IStarboard {
  id: string;
  starCount: number;
}
