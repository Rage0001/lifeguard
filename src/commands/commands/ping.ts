import { Command } from './command';
import { Client, Message, GuildTextableChannel } from 'eris';
import { Injectable, Scope } from '@nestjs/common';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class PingCommand extends Command {
  static _name = 'ping';
  static exec(lifeguard: Client, msg: Message<GuildTextableChannel>): void {
    msg.channel.createMessage('Pong!');
  }
}

export default {
  provide: PingCommand._name,
  useValue: PingCommand,
};
