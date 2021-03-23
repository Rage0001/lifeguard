import { DefaultSchema, Schema } from "./Schema.ts";

export interface GuildSchema extends DefaultSchema {
  blocked: boolean;
}
export class Guild extends Schema<GuildSchema> {}
