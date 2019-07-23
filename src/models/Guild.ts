import { model, Schema } from "mongoose";

export const Guild = new Schema({
  id: String,
  locale: String,
  modRole: String,
  prefix: String
});

export const GuildModel = model("guilds", Guild);

export interface IGuild {
  id: string;
  locale: string;
  modRole: string;
  prefix: string;
}

export function createGuild(guild: IGuild) {
  return GuildModel.create(guild);
}

export function findGuild(id: string) {
  return new Promise<IGuild | undefined>((res, rej) => {
    GuildModel.findOne(
      {
        id
      },
      (err, doc: IGuild) => {
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
