import { Inject, Injectable } from '@nestjs/common';
import { Client, GuildTextableChannel, Message } from 'eris';
import { CommandsService } from 'src/commands/commands.service';
import { Logger } from 'src/logger/logger.decorator';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class MessageService {
  constructor(
    @Inject('Lifeguard') private lifeguard: Client,
    @Logger('Events:MessageCreate') private logger: LoggerService,
    private commands: CommandsService
  ) {
    this.lifeguard.on('messageCreate', msg => {
      this.logger.log(`${msg.author}: ${msg.content}`);
      if (msg.guildID) {
        try {
          this.messageHandler(msg as Message<GuildTextableChannel>);
        } catch (error) {
          this.logger.log(error);
        }
      }
    });
  }

  async messageHandler(msg: Message<GuildTextableChannel>): Promise<void> {
    const [cmdArg, ...args] = msg.content.split(' ');
    if (cmdArg.startsWith(process.env.PREFIX)) {
      const cmd = cmdArg.slice(process.env.PREFIX.length);
      await this.commands.handle(msg, cmd, args);
    }
  }
}
