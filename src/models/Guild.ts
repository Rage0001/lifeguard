import { Document, model, Schema } from "mongoose";
import { config } from "../private/config";
import { IStarboard, Starboard } from "./Guild.Starboard";

export const Guild = new Schema({
  id: String,
  locale: String,
  modLog: String,
  modRole: String,
  prefix: {
    default: config.prefix,
    type: String
  },
  starboard: {
    default: [],
    type: [Starboard]
  },
  starboardChannel: String
});

export const GuildModel = model("guilds", Guild);

export interface IGuild {
  id: string;
  locale?: string;
  modLog?: string;
  modRole?: string;
  prefix?: string;
  starboard: IStarboard[];
  starboardChannel?: string;
}

export interface IGuildDoc extends Document {
  id: string;
  locale: string;
  modLog: string;
  modRole: string;
  prefix: string;
  starboard: IStarboard[];
  starboardChannel: string;
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

export function addStar(guildID: string, messageID: string) {
  return new Promise<IStarboard>(async (res, rej) => {
    const guild = await findGuild(guildID);
    if (guild) {
      const message = guild.starboard.find((message) => message.id === messageID);
      if (message) {
        message.starCount++;
        await guild.save((err) => {
          if (err) {
            rej(err);
          }
        });
        res(message);
      } else {
        const starMessage: IStarboard = {
          id: messageID,
          starCount: 1
        };
        guild.starboard.push(starMessage);
        guild.save((err) => {
          if (err) {
            rej(err);
          }
        });
        res(starMessage);
      }
    }
  });
}

export function removeStar(guildID: string, messageID: string) {
  return new Promise<IStarboard>(async (res, rej) => {
    const guild = await findGuild(guildID);
    if (guild) {
      const message = guild.starboard.find((message) => message.id === messageID);
      if (message) {
        if (message.starCount > 0) {
          message.starCount--;
        } else {
          message.starCount = 0;
        }
        await guild.save((err) => {
          if (err) {
            rej(err);
          }
        });
        res(message);
      } else {
        rej(new Error("Unknown Message"));
      }
    }
  });
}
