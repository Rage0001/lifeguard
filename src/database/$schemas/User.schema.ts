import { DefaultSchema, Schema } from "./Schema.ts";

export interface UserSchema extends DefaultSchema {
  blocked: boolean;
}
export class User extends Schema<UserSchema> {}
