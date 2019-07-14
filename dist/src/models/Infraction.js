"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const infractionSchema = new mongoose_1.default.Schema({
    action: String,
    active: Boolean,
    guild: Number,
    moderator: Number,
    reason: String,
    time: Date,
    uid: Number
});
exports.default = mongoose_1.default.model("Infraction", infractionSchema);
