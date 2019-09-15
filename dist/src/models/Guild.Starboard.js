"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.Starboard = new mongoose_1.Schema({
    id: String,
    starCount: {
        default: 0,
        type: Number
    }
});
