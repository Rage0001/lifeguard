import { Lifeguard } from "./src/bot.ts";
import { config } from ".env";

if (!import.meta.main) {
  throw new Error("main.ts must be the program entry point!");
}

const env = config({
  path: Deno.env.get("LG_ENV")?.startsWith("dev") ? "./.env.devel" : "./.env",
  safe: true,
});

new Lifeguard().connect(env.TOKEN);
