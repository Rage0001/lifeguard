import { Command } from '@plugins/Command';
import { defaultEmbed } from '@util/DefaultEmbed';
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
        defaultEmbed,
        dbUser,
        console,
      },
      { filename: msg.guild?.id.toString() }
    );

    const end = Date.now();

    if (typeof exec === 'string') {
      const embed = defaultEmbed()
        // .addField('Input', makeCodeBlock(script, 'js'))
        // .addField('Output', makeCodeBlock(exec, 'js'))
        .addFields([
          {
            name: 'Input',
            value: makeCodeBlock(script, 'js'),
          },
          {
            name: 'Output',
            value: makeCodeBlock(exec, 'js'),
          },
        ])
        .setFooter(`Script Executed in ${end - start}ms`);
      msg.channel.send(embed);
    } else {
      const embed = defaultEmbed()
        // .addField('Input', makeCodeBlock(script, 'js'))
        // .addField('Output', makeCodeBlock(`${exec.name}: ${exec.message}`))
        .addFields([
          {
            name: 'Input',
            value: makeCodeBlock(script, 'js'),
          },
          {
            name: 'Output',
            value: makeCodeBlock(`${exec.name}: ${exec.message}`),
          },
        ])
        .setFooter(`Script Executed in ${end - start}ms`);
      msg.channel.send(embed);
    }
  },
  {
    level: 5,
    usage: ['eval {code}'],
  }
);
