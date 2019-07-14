"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const util_1 = require("util");
const Plugin_1 = require("../plugins/Plugin");
async function loadPlugins() {
    try {
        const readDir = util_1.promisify(fs_1.readdir);
        const stats = util_1.promisify(fs_1.lstat);
        const plugins = [];
        const folders = await readDir("./dist/src/plugins");
        for await (const folder of folders) {
            const info = await stats(`./dist/src/plugins/${folder}`);
            if (info.isDirectory()) {
                const plugin = new Plugin_1.Plugin(folder);
                const files = await readDir(`./dist/src/plugins/${folder}`);
                for await (const file of files) {
                    const { command } = require(`../plugins/${folder}/${file}`);
                    plugin.commands.set(command.name, command);
                }
                plugins.push(plugin);
            }
        }
        return plugins;
    }
    catch (err) {
        return {
            location: "Plugin Loader",
            message: err
        };
    }
}
exports.loadPlugins = loadPlugins;
