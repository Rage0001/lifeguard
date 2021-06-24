import { LoggerModule } from './logger/logger.module';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [LoggerModule.forRoot(), BotModule, EventsModule],
  providers: [AppService],
})
export class AppModule {}
