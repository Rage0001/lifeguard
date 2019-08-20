import { Document, model, Schema } from "mongoose";

export const Guild = new Schema({
  id: String,
  locale: String,
  modLog: String,
  modRole: String,
  prefix: String
});

export const GuildModel = model("guilds", Guild);

export interface IGuild {
  id: string;
  locale?: string;
  modLog?: string;
  modRole?: string;
  prefix?: string;
}

export interface IGuildDoc extends Document {
  id: string;
  locale?: string;
  modLog?: string;
  modRole?: string;
  prefix?: string;
}

export function createGuild(guild: IGuild) {
  return GuildModel.create(guild);
}

export function findGuild(id: string) {
  return new Promise<IGuildDoc | undefined>((res, rej) => {
    GuildModel.findOne(
      {
        id
      },
      (err, doc: IGuildDoc) => {
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
