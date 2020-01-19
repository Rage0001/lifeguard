import { Command } from '../Command';
import { MessageEmbed } from 'discord.js';
import { inspect } from 'util';
import { runInNewContext } from 'vm';

function parseBlock(script: string) {
  const cbr = /^(([ \t]*`{3,4})([^\n]*)([\s\S]+?)(^[ \t]*\2))/gm;
  const result = cbr.exec(script);
  if (result) {
    return result[4];
  }
  return script;
}

async function run(
  script: string,
  ctx: object,
  opts: object
): Promise<string | Error> {
  try {
    const result = await runInNewContext(
      `(async () => { ${script} })()`,
      ctx,
      opts
    );
    if (typeof result !== 'string') {
      return inspect(result);
    }
    return result;
  } catch (err) {
    return err;
  }
}

function makeCodeBlock(data: string, lang?: string) {
  return `\`\`\`${lang}\n${data}\n\`\`\``;
}

export const command = new Command(
  'eval',
  async (lifeguard, msg, args, dbUser) => {
    const start = Date.now();

    const script = parseBlock(args.join(' '));
    const exec = await run(
      script,
      {
        lifeguard,
        msg,
        MessageEmbed,
        dbUser,
      },
      { filename: msg.guild?.id.toString() }
    );

    const end = Date.now();

    if (typeof exec === 'string') {
      const embed = new MessageEmbed()
        .addField('Input', makeCodeBlock(script, 'js'))
        .addField('Output', makeCodeBlock(exec, 'js'))
        .setFooter(`Script Executed in ${end - start}ms`)
        .setTimestamp()
        .setColor(0x7289da);
      msg.channel.send(embed);
    } else {
      const embed = new MessageEmbed()
        .addField('Input', makeCodeBlock(script, 'js'))
        .addField('Output', makeCodeBlock(`${exec.name}: ${exec.message}`))
        .setFooter(`Script Executed in ${end - start}ms`)
        .setTimestamp()
        .setColor(0x7289da);
      msg.channel.send(embed);
    }
  },
  {
    level: 5,
    usage: ['eval {code}'],
  }
);
