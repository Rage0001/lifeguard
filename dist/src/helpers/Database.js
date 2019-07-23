"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../private/config");
function connect() {
    mongoose_1.default.connect(config_1.config.database.url, {
        dbName: config_1.config.database.name,
        useNewUrlParser: true
    });
    const db = mongoose_1.default.connection;
    db.on("error", console.error.bind(console, "Connection error:"));
    db.once("open", () => {
        console.log("Connected to Database.");
    });
    return db;
}
exports.connect = connect;
