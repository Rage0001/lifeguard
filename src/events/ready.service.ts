import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'eris';
import { Logger } from 'src/logger/logger.decorator';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class ReadyService {
  constructor(
    @Inject('Lifeguard') private lifeguard: Client,
    @Logger('Events:Ready') private logger: LoggerService
  ) {
    this.lifeguard.once('ready', () =>
      this.logger.log(`Logged in as ${lifeguard.user.username}`)
    );
  }
}
