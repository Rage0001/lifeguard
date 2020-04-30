import { Command } from "@plugins/Command";

export const command: Command = new Command(
  "roles",
  async (lifeguard, msg) => {
    const roleList: string[] | undefined = msg.guild?.roles?.cache
      .sort((ra, rb) => rb.position - ra.position)
      .map(r => `${r.id} - ${r.name} (${r.members.size} members)`);
    const blocks: string[] = [];

    roleList?.forEach(r => {
      let currentBlockIndex: number = blocks.length - 1;

      if (
        blocks[currentBlockIndex].length > 1990 ||
        blocks[currentBlockIndex].concat(`\n${r}`).length > 1990
      ) {
        blocks.push("");
        currentBlockIndex++;
      }

      blocks[currentBlockIndex] += `\n${r}`;
    });

    blocks.forEach(b => msg.channel.send(`\`\`\`dns${b}\`\`\``));
  },
  {
    level: 1,
    usage: ["roles"]
  }
);
