import { Collection } from 'discord.js';
import { Command } from './Command';

export class Plugin extends Collection<string, Command> {
  constructor() {
    super();
  }
}
