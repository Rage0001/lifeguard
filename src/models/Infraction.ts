import mongoose from "mongoose";

const infractionSchema = new mongoose.Schema({
  action: String,
  active: Boolean,
  guild: Number,
  moderator: Number,
  reason: String,
  time: Date,
  uid: Number
});

export default mongoose.model("Infraction", infractionSchema);
