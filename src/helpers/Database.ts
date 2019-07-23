import mongoose from "mongoose";
import { config } from "../private/config";

export function connect() {
  mongoose.connect(config.database.url, {
    dbName: config.database.name,
    useNewUrlParser: true
  });

  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "Connection error:"));
  db.once("open", () => {
    console.log("Connected to Database.");
  });

  return db;
}
