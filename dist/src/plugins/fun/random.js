"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../Command");
exports.command = new Command_1.Command("random", async (msg, args, bot) => {
    try {
        const lang = bot.langs["en-US"].commands.random;
        switch (args[0]) {
            case "number":
                if (args[1] && args[2]) {
                    if (isNaN(parseInt(args[1], undefined)) ||
                        isNaN(parseInt(args[2], undefined))) {
                        return msg.channel.send(lang.errors.argsNAN);
                    }
                }
                const min = Number(args[1]) || 0;
                const max = Number(args[2]) || 10;
                msg.channel.send(`${Math.floor(Math.random() * (max - min) + min)}`);
                break;
            case "coin":
                let coin;
                const probability = Math.random() >= 0.5;
                if (probability) {
                    coin = `📀 (${lang.heads})`;
                }
                else {
                    coin = `💿 (${lang.tails})`;
                }
                msg.channel.send(coin);
                break;
        }
    }
    catch (err) {
        bot.logger.error(JSON.stringify(err));
    }
}, {
    guildOnly: true,
    hidden: false,
    level: 0,
    usage: ["random coin", "random number [start] [end]"]
});
