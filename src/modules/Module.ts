import type { Command } from "@modules/Command.ts";
import type { LifeguardCtx } from "@src/bot.ts";

export class Module {
  public commands: Map<string, Command>;
  constructor(private ctx: LifeguardCtx, public name: string) {
    this.commands = new Map();
  }

  async instansiate() {
    for await (const dirEntry of Deno.readDir(`./src/modules/${this.name}`)) {
      if (!dirEntry.isFile) continue;
      const command: Command = new (
        await import(`@modules/${this.name}/${dirEntry.name}`)
      ).default();
      this.commands.set(command.name, command);
    }
  }

  async register(guildid: string) {
    for (const [, command] of this.commands) {
      const cmd = await this.ctx.lifeguard.slash.commands
        .create(command, guildid)
        .catch((err) =>
          this.ctx.logger.error(`Module Register: ${command.name}`, err)
        );
      if (cmd) {
        cmd.handle((i) => command.handler(this.ctx, i));
      } else
        return Promise.reject(
          new Error(`No cmd for command ${command.name} on guild ${guildid}`)
        );
    }
  }

  async unregister(guildid: string) {
    const commands = await this.ctx.lifeguard.slash.commands.guild(guildid);
    for (const [, command] of commands) {
      await command
        .delete()
        .catch((err) =>
          this.ctx.logger.error(`Module Unregister: ${command.name}`, err)
        );
    }
  }
}
