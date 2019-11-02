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
                    if (file.split(".").length > 2 &&
                        file.split(".")[file.split(".").length - 1] === "js") {
                        const { command } = require(`../plugins/${folder}/${file}`);
                        const cmd = plugin.commands.get(file.split(".")[0]);
                        console.log(cmd);
                        if (cmd) {
                            cmd.addSubcommand(file.split(".")[1], command);
                        }
                        else {
                            const { command } = require(`../plugins/${folder}/${file.split(".")[0]}.js`);
                            if (command) {
                                plugin.commands.set(command.name, command);
                                const sub = require(`../plugins/${folder}/${file}`).command;
                                const cmd = plugin.commands.get(command.name);
                                if (cmd) {
                                    cmd.addSubcommand(file.split(".")[1], sub);
                                }
                            }
                        }
                    }
                    else if (file.endsWith(".js")) {
                        const { command } = require(`../plugins/${folder}/${file}`);
                        if (command) {
                            plugin.commands.set(command.name, command);
                        }
                    }
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
