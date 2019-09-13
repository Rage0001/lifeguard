import { ShardingManager } from "discord.js";
const Manager = new ShardingManager("./dist/index.js");

Manager.spawn(3, 20000);
Manager.on("launch", (shard) => {
  console.log(`Started ${shard.id}`);
})
