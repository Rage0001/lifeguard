import { Schema } from "./Schema.ts";

export interface UserSchema {
  id: string;
  blocked: boolean;
}
export class User extends Schema<UserSchema> {}
