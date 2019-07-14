"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const util_1 = __importDefault(require("util"));
const vm_1 = __importDefault(require("vm"));
const Command_1 = require("../Command");
exports.command = new Command_1.Command("eval", async (msg, args, bot) => {
    function parseBlock(data) {
        const regex = /```(js)?\n((.|\n)*)```/m;
        if (regex.test(data)) {
            const val = regex.exec(data);
            if (val) {
                return val[2];
            }
            else {
                return undefined;
            }
        }
        else {
            return undefined;
        }
    }
    const lang = bot.langs["en-US"].commands.eval;
    const token = new RegExp(bot.token, "g");
    const initTime = Date.now();
    const code = parseBlock(args.join(" "));
    if (code) {
        const evaled = await vm_1.default.runInNewContext(code, {
            bot,
            msg
        });
        let func = evaled;
        if (typeof func !== "string") {
            func = util_1.default.inspect(func);
        }
        const endTime = Date.now();
        if (func) {
            const embed = new discord_js_1.RichEmbed({
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
    }
    else {
        return msg.channel.send(bot.format(lang.failure, {
            reason: lang.reasons.parsingFailure
        }));
    }
}, {
    guildOnly: true,
    hidden: true,
    level: 5,
    usage: ["eval [thing to eval]"]
});
