"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.Guild = new mongoose_1.Schema({
    id: String,
    locale: String,
    modRole: String,
    prefix: String
});
exports.GuildModel = mongoose_1.model("guilds", exports.Guild);
function createGuild(guild) {
    return exports.GuildModel.create(guild);
}
exports.createGuild = createGuild;
function findGuild(id) {
    return new Promise((res, rej) => {
        exports.GuildModel.findOne({
            id
        }, (err, doc) => {
            if (err) {
                return rej(err);
            }
            if (doc) {
                res(doc);
            }
            else {
                res(undefined);
            }
        });
    });
}
exports.findGuild = findGuild;
