import { Module } from '@nestjs/common';
import { BotModule } from 'src/bot/bot.module';
import { CommandsModule } from 'src/commands/commands.module';
import { LoggerModule } from 'src/logger/logger.module';
import { MessageService } from './message.service';
import { ReadyService } from './ready.service';

@Module({
  imports: [LoggerModule.forRoot(), BotModule, CommandsModule.forRoot()],
  providers: [MessageService, ReadyService],
})
export class EventsModule {}
