import { model, Schema } from "mongoose";
import { IInfraction, Infraction } from "./Infraction";

export const User = new Schema({
  id: String,
  infractions: [Infraction]
});

export const UserModel = model("users", User);

export interface IUser {
  id: string;
  infractions: IInfraction[];
}

export function createUser(user: IUser) {
  return UserModel.create(user);
}

export function findUser(id: string) {
  return new Promise<IUser | undefined>((res, rej) => {
    UserModel.findOne(
      {
        id
      },
      (err, doc: IUser) => {
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
