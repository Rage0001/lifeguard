import { Lifeguard } from "@src/bot.ts";
import { config } from ".env";

if (!import.meta.main) {
  throw new Error("main.ts must be the program entry point!");
}
try {
  const devel = Deno.env.get("LG_ENV")?.startsWith("dev");
  const env = config({
    path: devel ? "./.env.devel" : "./.env",
    safe: true,
    allowEmptyValues: false,
  });
  const lifeguard = new Lifeguard({
    debug: devel!,
    db: {
      mongo: {
        uri: env.MONGO_URI,
        dbName: env.MONGO_DBNAME,
      },
      redis: {
        hostname: env.REDIS_HOST,
        port: env.REDIS_PORT,
      },
    },
  });
  await lifeguard
    .loadEvents()
    .then(() => lifeguard.logger.debug("Loaded Events"));
  await lifeguard.connect(env.TOKEN);
} catch (error) {
  console.error(error);
}
