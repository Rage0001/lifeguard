import {Collection} from 'discord.js';
import {Command} from '@plugins/Command';

export class Plugin extends Collection<string, Command> {
  constructor(public name: string) {
    super();
  }
}
