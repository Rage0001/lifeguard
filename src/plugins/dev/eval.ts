import { RichEmbed } from "discord.js";
import util from "util";
import vm from "vm";
import { Command } from "../Command";

export const command = new Command(
  "eval",
  async (msg, args, bot) => {
    function parseBlock(data: string) {
      // const regex = /```(js)?\n((.|\n)*)```/m;
      // if (regex.test(data)) {
      //   const val = regex.exec(data);
      //   if (val) {
      //     return data[2];
      //   } else {
      //     return undefined;
      //   }
      // } else {
      //   return undefined;
      // }
      return data;
    }

    const lang = bot.langs["en-US"].commands.eval;
    const token = new RegExp(bot.token, "g");

    const initTime = Date.now();

    const code = parseBlock(args.join(" "));
    if (code) {
      const evaled = await vm.runInNewContext(code, {
        bot,
        msg
      });

      let func = evaled;
      if (typeof func !== "string") {
        func = util.inspect(func);
      }

      const endTime = Date.now();

      if (func) {
        const embed = new RichEmbed({
          fields: [
            {
              name: lang.input,
              value: bot.format("```js\n{code}\n```", { code })
            },
            {
              name: lang.output,
              value: bot.format("```js\n{code}\n```", {
                code: func.replace(token, "Secret")
              })
            }
          ],
          footer: {
            text: bot.format(lang.timeTaken, {
              timeTaken: `${endTime - initTime}`
            })
          }
        });
        msg.channel.send(embed);
      }
    } else {
      return msg.channel.send(
        bot.format(lang.failure, {
          reason: lang.reasons.parsingFailure
        })
      );
    }
  },
  {
    guildOnly: true,
    hidden: true,
    level: 5,
    usage: ["eval {code}"]
  }
);
