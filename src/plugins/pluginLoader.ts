import { promisify } from 'util';
import { readdir, lstat } from 'fs';
import { Collection } from 'discord.js';
import { Plugin } from './Plugin';
import { Command } from './Command';

export async function PluginLoader() {
  const readDir = promisify(readdir);
  const stats = promisify(lstat);

  const plugins = new Collection<string, Plugin>();

  const pluginDir = './build/src/plugins';
  const folders = await readDir(pluginDir);
  for await (const folder of folders) {
    const folderDir = `${pluginDir}/${folder}`;
    const info = await stats(folderDir);
    if (info.isDirectory()) {
      const plugin = new Plugin();

      const files = await readDir(`${folderDir}`);
      for await (const file of files) {
        if (file.endsWith('.js')) {
          const command: Command = require(`./${folder}/${file}`).command;
          plugin.set(command.name, command);
        }
      }

      plugins.set(folder, plugin);
    }
  }

  return plugins;
}
