import { Command } from '../Command';

export const command = new Command(
  'help',
  (lifeguard, msg, args) => {
    const cmds = Array.from(lifeguard.plugins.values())
      .map(plugin => Array.from(plugin.values()))
      .reduce((acc, val) => acc.concat(val), [])
      .filter(cmd => !cmd.options.hidden)
      .sort((a, b) => a.name.localeCompare(b.name));
    msg.channel.send(cmds.map(c => c.name).join('\n'));
  },
  {
    level: 0,
    usage: ['help', 'help [name]'],
  }
);
