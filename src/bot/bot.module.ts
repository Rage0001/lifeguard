import { BotService } from './bot.service';
import { Module } from '@nestjs/common';
import { Client } from 'eris';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [LoggerModule.forRoot()],
  providers: [
    {
      provide: 'Lifeguard',
      useFactory: () => {
        return new Client(process.env.TOKEN!, {
          intents: ['guilds', 'guildMessages'],
        });
      },
    },
    BotService,
  ],
  exports: ['Lifeguard', BotService],
})
export class BotModule {}
