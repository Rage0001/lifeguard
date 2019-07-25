"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class ReminderUser extends discord_js_1.User {
    constructor(client, data) {
        super(client, data);
        this.reminders = [];
    }
}
exports.ReminderUser = ReminderUser;
