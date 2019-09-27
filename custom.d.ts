import { IInfraction } from "./src/models/Infraction";
import { Command } from "./src/plugins/Command";

declare module "discord.js" {
  export interface Client {
    on(
      event: "addUserInfraction",
      listener: (user: GuildMember, infraction: IInfraction) => void
    ): this;
    on(
      event: "addUserBlacklist",
      listener: (user: GuildMember, reason?: string) => void
    ): this;
    on(
      event: "lifeguardCommandUsed",
      listener: (message: Message, command: Command) => void
    ): this;
  }
}
