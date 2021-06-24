/* eslint-disable @typescript-eslint/no-unused-vars */
import { Client, Message, GuildTextableChannel } from 'eris';
export abstract class Command {
  static _name: string;
  static exec(
    lifeguard: Client,
    msg: Message<GuildTextableChannel>,
    args: string[]
  ): void {}
}
