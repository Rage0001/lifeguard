import { lstat, readdir } from "fs";
import { promisify } from "util";
import { Plugin } from "../plugins/Plugin";

export async function loadPlugins() {
  try {
    const readDir = promisify(readdir);
    const stats = promisify(lstat);

    const plugins: Plugin[] = [];

    const folders = await readDir("./dist/src/plugins");

    for await (const folder of folders) {
      const info = await stats(`./dist/src/plugins/${folder}`);
      if (info.isDirectory()) {
        const plugin = new Plugin(folder);

        const files = await readDir(`./dist/src/plugins/${folder}`);

        for await (const file of files) {
          const { command } = require(`../plugins/${folder}/${file}`);
          plugin.commands.set(command.name, command);
        }

        plugins.push(plugin);
      }
    }

    return plugins;
  } catch (err) {
    return {
      location: "Plugin Loader",
      message: err
    };
  }
}
