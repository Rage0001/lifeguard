"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = require("../private/config");
const Guild_Starboard_1 = require("./Guild.Starboard");
const Guild_Role_1 = require("./Guild.Role");
exports.Guild = new mongoose_1.Schema({
    id: String,
    locale: String,
    modLog: String,
    modRole: String,
    muteRole: String,
    prefix: {
        default: config_1.config.prefix,
        type: String
    },
    roles: {
        default: [],
        type: [Guild_Role_1.Role]
    },
    starboard: {
        default: [],
        type: [Guild_Starboard_1.Starboard]
    },
    starboardChannel: String
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
function addStar(guildID, messageID) {
    return new Promise(async (res, rej) => {
        const guild = await findGuild(guildID);
        if (guild) {
            const message = guild.starboard.find(message => message.id === messageID);
            if (message) {
                message.starCount++;
                await guild.save(err => {
                    if (err) {
                        rej(err);
                    }
                });
                res(message);
            }
            else {
                const starMessage = {
                    id: messageID,
                    starCount: 1
                };
                guild.starboard.push(starMessage);
                guild.save(err => {
                    if (err) {
                        rej(err);
                    }
                });
                res(starMessage);
            }
        }
    });
}
exports.addStar = addStar;
function removeStar(guildID, messageID) {
    return new Promise(async (res, rej) => {
        const guild = await findGuild(guildID);
        if (guild) {
            const message = guild.starboard.find(message => message.id === messageID);
            if (message) {
                if (message.starCount > 0) {
                    message.starCount--;
                }
                else {
                    message.starCount = 0;
                }
                await guild.save(err => {
                    if (err) {
                        rej(err);
                    }
                });
                res(message);
            }
            else {
                rej(new Error("Unknown Message"));
            }
        }
    });
}
exports.removeStar = removeStar;
