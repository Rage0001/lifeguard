"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.Infraction = new mongoose_1.Schema({
    action: String,
    active: Boolean,
    guild: String,
    moderator: String,
    reason: String,
    time: Date,
    user: String
});
