import moment from "moment";
import ms from "ms";
import Schedule from "node-schedule";
import { findUser } from "../../models/User";
import { Command } from "../Command";

export const command = new Command(
  "remind",
  async (msg, args, bot) => {
    const lang = bot.langs["en-US"].commands.remind;
    const user = await findUser(msg.author.id);
    if (user) {
      let reminders: Schedule.Job[] = user.get("reminders");

      switch (args[0]) {
        case "add":
          const givenTimestamp = ms(args[1]);
          const currentDate = Date.now();
          if (!givenTimestamp) {
            return msg.channel.send(bot.format(lang.errors.failedTimestamp, {
              arg: args[1]
            }));
          }
          const text = args.slice(2).join(" ");
          msg.channel.send(bot.format(lang.body, {
            text,
            timestamp: moment(currentDate + givenTimestamp).format(),
          }));
          const reminder = Schedule.scheduleJob(new Date(currentDate + givenTimestamp), () => {
            msg.author.send(bot.format(lang.reminder, {
              text,
              timestamp: moment(currentDate + givenTimestamp).format()
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
          reminders.forEach((r: Schedule.Job | null) => {
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
  },
  {
    guildOnly: false,
    hidden: false,
    level: 0,
    usage: ["remind add {time} [text]", "remind clear"]
  }
);
