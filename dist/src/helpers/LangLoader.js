"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const util_1 = require("util");
async function loadLangs(bot) {
    try {
        const readDir = util_1.promisify(fs_1.readdir);
        const files = await readDir("./dist/src/lang");
        for await (const file of files) {
            const lang = require(`../lang/${file}`);
            const locale = file.split(".json")[0];
            bot.langs[locale] = lang;
        }
    }
    catch (err) {
        return {
            location: "Language Loader",
            message: err
        };
    }
}
exports.loadLangs = loadLangs;
