import { Event } from './Event';
import { Message } from 'discord.js';
import { prefix } from '../config/bot';

export const event = new Event('message', async (lifeguard, msg: Message) => {
  if (msg.content.startsWith(prefix)) {
    lifeguard.emit('lifeguardCommandUsed', msg);
  }
});
