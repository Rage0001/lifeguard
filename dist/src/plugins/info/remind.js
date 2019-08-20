"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const ms_1 = __importDefault(require("ms"));
const node_schedule_1 = __importDefault(require("node-schedule"));
const User_1 = require("../../models/User");
const Command_1 = require("../Command");
exports.command = new Command_1.Command("remind", async (msg, args, bot) => {
    const lang = bot.langs["en-US"].commands.remind;
    const user = await User_1.findUser(msg.author.id);
    if (user) {
        let reminders = user.get("reminders");
        switch (args[0]) {
            case "add":
                const givenTimestamp = ms_1.default(args[1]);
                const currentDate = Date.now();
                if (!givenTimestamp) {
                    return msg.channel.send(bot.format(lang.failedTimestamp, {
                        arg: args[1]
                    }));
                }
                const text = args.slice(2).join(" ");
                msg.channel.send(bot.format(lang.body, {
                    text,
                    timestamp: moment_1.default(currentDate + givenTimestamp).format(),
                }));
                const reminder = node_schedule_1.default.scheduleJob(new Date(currentDate + givenTimestamp), () => {
                    msg.author.send(bot.format(lang.reminder, {
                        text,
                        timestamp: moment_1.default(currentDate + givenTimestamp).format()
                    }));
                    delete reminders[reminders.indexOf(reminder)];
                    user.set("reminders", reminders.filter((reminder) => reminder !== null));
                    user.markModified("reminders");
                    user.save();
                });
                reminders.push(reminder);
                user.markModified("reminders");
                user.save();
                break;
            case "clear":
                msg.channel.send(`Cleared \`${reminders.length}\` reminders.`);
                reminders.forEach((r) => {
                    if (r !== null) {
                        r.cancel();
                    }
                });
                reminders = [];
                user.set("reminders", reminders);
                user.markModified("reminders");
                user.save();
                break;
        }
    }
}, {
    guildOnly: false,
    hidden: false,
    level: 0,
    usage: ["remind add {time} [text]", "remind clear"]
});
