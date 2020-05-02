import {promisify} from 'util';
import {readdir, lstat, Stats} from 'fs';
import {Collection} from 'discord.js';
import {Plugin} from './Plugin';
import {Command} from './Command';

export async function PluginLoader() {
  const readDir = promisify(readdir);
  const stats = promisify(lstat);

  const plugins: Collection<string, Plugin> = new Collection<string, Plugin>();

  const pluginDir = './build/src/plugins';
  const folders: string[] = await readDir(pluginDir);
  for await (const folder of folders) {
    const folderDir = `${pluginDir}/${folder}`;
    const info: Stats = await stats(folderDir);
    if (info.isDirectory()) {
      const plugin: Plugin = new Plugin(folder);

      const files: string[] = await readDir(`${folderDir}`);
      for await (const file of files) {
        if (file.endsWith('.js')) {
          const {command} = (await import(`./${folder}/${file}`)) as {
            command: Command;
          };
          if (command instanceof Command) {
            plugin.set(command.name, command);
          }
        }
      }

      plugins.set(folder, plugin);
    }
  }

  return plugins;
}
