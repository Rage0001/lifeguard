import { Schema } from "mongoose";

export const Role = new Schema({
  id: String,
  name: String
});

export interface IRole {
  id: string;
  name: string;
}
