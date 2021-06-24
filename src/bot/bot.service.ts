import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'eris';

@Injectable()
export class BotService {
  constructor(@Inject('Lifeguard') private lifeguard: Client) {}

  init(): Promise<void> {
    return this.lifeguard.connect();
  }
}
