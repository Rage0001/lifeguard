import { Document, model, Schema } from "mongoose";
import { Job } from "node-schedule";
import { IInfraction, Infraction } from "./Infraction";

export const User = new Schema({
  id: String,
  infractions: [Infraction],
  reminders: Array
});

export const UserModel = model("users", User);

export interface IUser {
  id: string;
  infractions: IInfraction[];
  reminders: Job[];
}

export interface IUserDoc extends Document {
  id: string;
  infractions: IInfraction[];
  reminders: Job[];
}

export function createUser(user: IUser) {
  return UserModel.create(user);
}

export function findUser(id: string) {
  return new Promise<IUserDoc | undefined>((res, rej) => {
    UserModel.findOne(
      {
        id
      },
      (err, doc: IUserDoc) => {
        if (err) {
          return rej(err);
        }
        if (doc) {
          res(doc);
        } else {
          res(undefined);
        }
      }
    );
  });
}
