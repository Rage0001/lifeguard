"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../private/config");
function calcLevel(user, guild) {
    if (config_1.config.developers.indexOf(user.id) !== -1) {
        return 5;
    }
    if (user.id === guild.ownerID) {
        return 4;
    }
    if (user.hasPermission("ADMINISTRATOR")) {
        return 3;
    }
    return 0;
}
exports.calcLevel = calcLevel;
