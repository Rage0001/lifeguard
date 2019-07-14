"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const config_1 = require("../private/config");
function connect() {
    mongoose_1.connect(config_1.config.database.url, {
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
