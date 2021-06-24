import { Injectable } from '@nestjs/common';
import { BotService } from './bot/bot.service';
import { Logger } from './logger/logger.decorator';
import { LoggerService } from './logger/logger.service';

@Injectable()
export class AppService {
  constructor(
    private botService: BotService,
    @Logger('AppService') private logger: LoggerService
  ) {}
  async init(): Promise<void> {
    this.logger.log('Starting Bot');
    await this.botService.init();
  }
}
