// import { Module } from '@nestjs/common';
// import { BotModule } from 'src/bot/bot.module';
// import { LoggerModule } from 'src/logger/logger.module';
// import { CommandsService } from './commands.service';

// @Module({
//   imports: [LoggerModule.forRoot(), BotModule],
//   providers: [CommandsService],
//   exports: [CommandsService],
// })
// export class CommandsModule {}

import { DynamicModule } from '@nestjs/common';
import { BotModule } from 'src/bot/bot.module';
import { LoggerModule } from 'src/logger/logger.module';
import { loadCommands } from './commands.loader';
import { CommandsService } from './commands.service';

export class CommandsModule {
  static async forRoot(): Promise<DynamicModule> {
    const commands = await loadCommands();
    return {
      module: CommandsModule,
      imports: [LoggerModule.forRoot(), BotModule],
      providers: [CommandsService, ...commands],
      exports: [CommandsService],
    };
  }
}
