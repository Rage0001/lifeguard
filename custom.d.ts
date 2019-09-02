import { IInfraction } from "./src/models/Infraction";

declare module 'discord.js' {
  export interface Client {
    on(event: "addUserInfraction", listener: (user: GuildMember, infraction: IInfraction) => void): this;
  }
}