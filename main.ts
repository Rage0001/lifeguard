import { Lifeguard } from "@src/bot.ts";
import { config } from ".env";

if (!import.meta.main) {
  throw new Error("main.ts must be the program entry point!");
}
try {
  const env = config({
    path: Deno.env.get("LG_ENV")?.startsWith("dev") ? "./.env.devel" : "./.env",
    safe: true,
  });
  const lifeguard = new Lifeguard();
  await lifeguard.loadEvents().then(() => console.log("Loaded Events"));
  await lifeguard.connect(env.TOKEN);
} catch (error) {
  console.error(error);
}
