import { ShardingManager } from "discord.js";
const Manager = new ShardingManager("./dist/index.js");

Manager.spawn(3);
Manager.on("launch", (shard) => {
  console.log(`Started ${shard.id}`);
})
