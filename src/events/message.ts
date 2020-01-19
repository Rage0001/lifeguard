import { Event } from './Event';
import { Message } from 'discord.js';
import { prefix } from '../config/bot';
import { User, UserDoc } from '../models/User';

export const event = new Event('message', async (lifeguard, msg: Message) => {
  let dbUser = (await lifeguard.db.users.findOne({
    id: msg.author.id,
  })) as UserDoc;
  if (!dbUser) {
    await lifeguard.db.users.insertOne(
      new User({ id: msg.author.id, infractions: [] })
    );
    dbUser = (await lifeguard.db.users.findOne({
      id: msg.author.id,
    })) as UserDoc;
  }
  if (msg.content.startsWith(prefix)) {
    lifeguard.emit('lifeguardCommandUsed', msg, dbUser);
  }
});
