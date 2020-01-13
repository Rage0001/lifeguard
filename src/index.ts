import { Client } from 'discord.js';
import { token } from './config/bot';

const lifeguard = new Client();

lifeguard
  .login(token)
  .then(_ =>
    console.log(
      `Logged in to ${lifeguard.user.username}#${lifeguard.user.discriminator}`
    )
  );
