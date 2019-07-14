"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const util_1 = require("util");
async function loadEvents(bot) {
    try {
        const readDir = util_1.promisify(fs_1.readdir);
        const items = await readDir("./dist/src/events");
        for await (const item of items) {
            if (item !== "Event.js") {
                const { event } = require(`../events/${item}`);
                bot.on(event.name, (...args) => {
                    event.func(bot, ...args);
                });
            }
        }
    }
    catch (err) {
        return {
            location: "Event Loader",
            message: err
        };
    }
}
exports.loadEvents = loadEvents;
