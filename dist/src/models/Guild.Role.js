"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.Role = new mongoose_1.Schema({
    id: String,
    name: String
});
