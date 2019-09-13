import { ShardingManager } from "discord.js";
const Manager = new ShardingManager("./dist/index.js");

Manager.spawn(5);
Manager.on("launch", (shard) => {
  console.log(`Started ${shard.id}`);
})
