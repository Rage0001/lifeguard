"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Guild_1 = require("../models/Guild");
const config_1 = require("../private/config");
async function calcLevel(user, guild) {
    const guildConfig = await Guild_1.findGuild(guild.id);
    if (guildConfig) {
        if (config_1.config.developers.indexOf(user.id) !== -1) {
            return 5;
        }
        if (user.id === guild.ownerID) {
            return 4;
        }
        if (user.hasPermission("ADMINISTRATOR")) {
            return 3;
        }
        if (user.roles.has(guildConfig.modRole)) {
            return 2;
        }
    }
    return 0;
}
exports.calcLevel = calcLevel;
