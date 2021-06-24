import { ClassProvider } from '@nestjs/common';
import { readdir } from 'fs/promises';
import { Command } from './commands/command';

export async function loadCommands(): Promise<ClassProvider<Command>[]> {
  const files = await readdir('./dist/commands/commands');
  const commandFiles = files
    .filter(f => f.endsWith('.js'))
    .filter(f => f !== 'command.js');
  const commands = await Promise.all(
    commandFiles.map(async f => await import(`./commands/${f}`))
  );
  return commands.map(c => c.default);
}
