"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("./Event");
exports.event = new Event_1.Event("debug", async (bot, info) => {
    bot.logger.debug(info);
});
