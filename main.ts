import { Lifeguard } from "/src/bot.ts";
import { config } from ".env";

if (!import.meta.main) {
  throw new Error("main.ts must be the program entry point!");
}

config();
new Lifeguard().connect();
