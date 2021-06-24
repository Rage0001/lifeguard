import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Client, Message, GuildTextableChannel } from 'eris';
import { Logger } from 'src/logger/logger.decorator';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class CommandsService {
  constructor(
    @Inject('Lifeguard') private lifeguard: Client,
    @Logger('CommandService') private logger: LoggerService,
    private moduleRef: ModuleRef
  ) {}

  async handle(
    msg: Message<GuildTextableChannel>,
    command: string,
    args: string[]
  ): Promise<void> {
    this.logger.log(`Used Command: ${command} [${args.join(', ')}]`);
    try {
      const cmd = await this.moduleRef.resolve(command);
      cmd.exec(this.lifeguard, msg, args);
    } catch (error) {
      this.logger.log(error);
      await msg.channel.createMessage(error.message);
    }
  }
}
